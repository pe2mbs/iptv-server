import re
from enum import Enum
from tasks.downloader.tables import *


class M3uItemType( Enum ):
    NONE            = 0
    IPTV_CHANNEL    = 1
    SERIE_EPISODE   = 2
    MOVIE           = 3


""" Translate
    'EX YU', 'EX-YU'    => 'YU'
    'CA-FR'             => 'FR'
    'NL H265'           => 'NL'
    'NL HEVC'           => 'NL'
    'SE VIP'            => 'SE'
    'NO VIP'            => 'NO'
    'PL VIP'            => 'PL'
    'RO(L)'             => 'RO'
"""


class M3URecord( object ):
    __RE_ATTRIBUTE  = re.compile( r"(\w*-\w*)=([\"'].*?[\"'])" )
    __RE_SERIE      = re.compile( r'([\w\s&!-_]+)(([Ss]\d{1,2})([ -]+|)([EeXx]\d{1,2}))' )
    __COUNTRY_CODES = [ 'UK', 'FR', 'PL', 'US', 'NL', 'BE', 'DE', 'SE', 'DK', 'ES', 'NO', 'RO', 'PT', 'TR', 'IN', 'AR', 'IE', 'IT', 'AF', 'CA', 'AL',
                        'GR', 'HU', 'BG', 'YU', 'FI', 'PK', 'RU', 'PB' ]
    def __init__( self, media_files = None ):
        self.__type         = M3uItemType.NONE
        self.__MEDIA_FILES  = [ '.mp4', '.avi', '.mkv', '.flv' ]
        self.__duration     = -1
        self.__name         = ''
        self.__link         = ''
        self.__season       = ''
        self.__episode      = ''
        self.__group        = ''
        self.__attributes   = {}
        self.__tvg_id       = ''
        self.__tvg_logo     = ''
        self.__tvg_name     = ''
        self.__country      = ''
        if isinstance( media_files, ( list, tuple ) ):
            for item in media_files:
                if item not in self.__MEDIA_FILES:
                    self.__MEDIA_FILES.append( item )

        return

    def clear( self ):
        self.__type         = M3uItemType.NONE
        self.__duration     = -1
        self.__name         = ''
        self.__link         = ''
        self.__season       = ''
        self.__episode      = ''
        self.__group        = ''
        self.__attributes   = {}
        self.__tvg_id       = ''
        self.__tvg_logo     = ''
        self.__tvg_name     = ''
        self.__country      = ''
        return

    def set( self, data: list ):
        self.__duration     = int( data[ 0 ].strip() )
        self.__name         = data[ 3 ].strip()
        self.__link         = data[ 4 ].strip()
        for label, value in self.__RE_ATTRIBUTE.findall( data[ 2 ] ):
            value = value.replace( '"', '' ).strip()
            if label == 'tvg-id':
                self.__tvg_id   = value

            elif label == 'tvg-logo':
                self.__tvg_logo = value

            elif label == 'tvg-name':
                self.__tvg_name = value

            elif label == 'group-title':
                self.__group    = value

            else:
                self.__attributes[ label.strip() ] = value

        result = self.__RE_SERIE.match( self.__name )
        if result:
            self.__type     = M3uItemType.SERIE_EPISODE
            groups = result.groups()
            self.__season   = groups[ 2 ].strip()
            self.__episode  = groups[ 4 ].strip()
            self.__group    = groups[ 0 ].strip()

        else:
            self.__type     = M3uItemType.MOVIE if self.__link.endswith( tuple( self.__MEDIA_FILES ) ) else M3uItemType.IPTV_CHANNEL
            if self.__type == M3uItemType.MOVIE:
                self.__group    = f'Movies: {self.__group}'

        for char in ( '|', ':', '-' ):
            self.__name, country = self.ripCountryCode( self.__name, char )
            if country is not None:
                self.__country = country
                break

        return

    def ripCountryCode( self, name, char ):
        country = None
        names = [ item.strip() for item in name.split( char, 1 ) ]
        if len( names ) > 1:
            prefix, suffix = names
            if len( prefix ) == 2 and prefix in self.__COUNTRY_CODES:
                name = suffix
                country = prefix

            elif len( suffix ) == 2 and suffix in self.__COUNTRY_CODES:
                name = prefix
                country = suffix

        return ( name, country )

    def __repr__(self):
        return f"<M3URecord name='{self.__name}' group='{self.__group}' link='{self.__link}'>"

    @property
    def Type( self ) -> M3uItemType:
        return self.__type

    @property
    def Duration( self ) -> int:
        return self.__duration

    @property
    def Name( self ) -> str:
        return self.__name

    @property
    def Group( self ) -> str:
        return self.__group

    @property
    def Link( self ) -> str:
        return self.__link

    @property
    def TvgId( self ):
        return self.__tvg_id

    @property
    def TvgLogo( self ):
        return self.__tvg_logo

    @property
    def TvgName( self ):
        return self.__tvg_name

    def attribute( self, key ):
        return self.__attributes.get( key )

    @staticmethod
    def matchList( ilist: list, data: str ):
        for item in ilist:
            if re.match( item, data, re.IGNORECASE ) is not None:
                return True

        return False

    def get( self, data ):
        if isinstance( data, IptvChannel ):
            self.__type         = M3uItemType.IPTV_CHANNEL
            if isinstance( data.IC_ALIAS, str ) and data.IC_ALIAS != '':
                self.__name         = data.IC_ALIAS

            else:
                self.__name         = data.IC_NAME

            self.__country      = data.IC_COUNTRY
            self.__group        = data.IC_GROUP
            self.__duration     = data.IC_DURATION
            self.__link         = data.IC_LINK
            self.__tvg_id       = data.IC_TVG_ID
            self.__tvg_logo     = data.IC_TVG_LOGO
            self.__tvg_name     = data.IC_TVG_NAME

        elif isinstance( data, IptvEpisode ):
            self.__type         = M3uItemType.SERIE_EPISODE
            self.__name         = data.IE_NAME
            self.__country      = data.IE_COUNTRY
            self.__group        = data.IE_GROUP
            self.__duration     = data.IE_DURATION
            self.__link         = data.IE_LINK
            self.__tvg_id       = data.IE_TVG_ID
            self.__tvg_logo     = data.IE_TVG_LOGO
            self.__tvg_name     = data.IE_TVG_NAME

        elif isinstance( data, IptvMovie ):
            self.__type         = M3uItemType.MOVIE
            self.__name         = data.IM_NAME
            self.__group        = data.IM_GROUP
            self.__country      = data.IM_COUNTRY
            self.__duration     = data.IM_DURATION
            self.__link         = data.IM_LINK
            self.__tvg_id       = data.IM_TVG_ID
            self.__tvg_logo     = data.IM_TVG_LOGO
            self.__tvg_name     = data.IM_TVG_NAME

        else:
            raise Exception( "Fail" )

        return

    def put( self, data ):
        if isinstance( data, IptvChannel ) and self.__type == M3uItemType.IPTV_CHANNEL:
            data.IC_NAME        = self.__name
            data.IC_GROUP       = self.__group
            data.IC_COUNTRY     = self.__country
            data.IC_DURATION    = self.__duration
            data.IC_LINK        = self.__link
            data.IC_TVG_ID      = self.__tvg_id
            data.IC_TVG_LOGO    = self.__tvg_logo
            data.IC_TVG_NAME    = self.__tvg_name

        elif isinstance( data, IptvBouget ) and self.__type == M3uItemType.IPTV_CHANNEL:
            data.IB_NAME        = self.__group
            data.IB_COUNTRY     = self.__country

        elif isinstance( data, IptvSerie ) and self.__type == M3uItemType.SERIE_EPISODE:
            data.IS_NAME        = self.__group
            data.IS_COUNTRY     = self.__country

        elif isinstance( data, IptvEpisode ) and self.__type == M3uItemType.SERIE_EPISODE:
            data.IE_NAME        = self.__name
            data.IE_GROUP       = self.__group
            data.IE_COUNTRY     = self.__country
            data.IE_LINK        = self.__link
            data.IE_DURATION    = self.__duration
            data.IE_EPISODE     = int( self.__episode[ 1 : ] )
            data.IE_SEASON      = int( self.__season[ 1 : ] )
            data.IE_TVG_ID      = self.__tvg_id
            data.IE_TVG_NAME    = self.__tvg_name
            data.IE_TVG_LOGO    = self.__tvg_logo

        elif isinstance( data, IptvMovie ) and self.__type == M3uItemType.MOVIE:
            data.IM_NAME        = self.__name
            data.IM_GROUP       = self.__group
            data.IM_COUNTRY     = self.__country
            data.IM_LINK        = self.__link
            data.IM_DURATION    = self.__duration
            data.IM_TVG_ID      = self.__tvg_id
            data.IM_TVG_NAME    = self.__tvg_name
            data.IM_TVG_LOGO    = self.__tvg_logo
            pass

        else:
            raise Exception( "Don't know how to put the data" )
