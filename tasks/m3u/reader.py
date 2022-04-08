import re
import requests
from tasks.m3u.record import M3uItemType, M3URecord



class M3UDeserializer( object ):
    __RE_ITEM         = re.compile( r"(?:^|\n)#EXTINF:((?:-)\d+(\.\d+)?)([^,]+)?,([A-Z].*?)[\r\n]+(.*)" )
    __RE_ATTRIBUTE    = re.compile( r"(\w*-\w*)=([\"'].*?[\"'])" )
    __RE_SERIE        = re.compile( r'([\w\s&!-_]+)(([Ss]\d{1,2})([ -]+|)([EeXx]\d{1,2}))' )

    def __init__( self, url_filename, media_files = None, **kwargs ):
        self.__DATA         = ''
        self.__MEDIA_FILES  = [ '.mp4', '.avi', '.mkv', '.flv' ]
        self.__kwargs       = kwargs
        if isinstance( media_files, ( list, tuple ) ):
            for item in media_files:
                if item not in self.__MEDIA_FILES:
                    self.__MEDIA_FILES.append( item )

        if url_filename.startswith( ( 'http://', 'https://' ) ):
            self.__downloadUrl( url_filename )

        elif url_filename.startswith( 'file://' ):
            self.__openFile( url_filename[ 7: ] )

        else:
            self.__openFile( url_filename )

        return

    def __openFile( self, filename ):
        self.__DATA = open( filename, 'r' ).read()
        return

    def __downloadUrl( self, url ):
        r = requests.get( url )
        if r.status_code == 200:
            self.__DATA = r.text

        return

    def __iter__(self):
        """This iterate through the M3U data, and yields ( <type>, <title>, <record> )
        where
            <type>      M3uItemType
            <title>     str
            <record>    dict

        :return:
        """
        # Conversion needed as enswith() only accepts str or tuple
        record = M3URecord()
        for item in self.__RE_ITEM.findall( self.__DATA ):
            record.clear()
            record.set( item )
            yield record

        return
