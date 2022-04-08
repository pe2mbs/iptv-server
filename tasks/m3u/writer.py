from tasks.m3u.record import M3URecord


class M3USerializer( object ):
    def __init__( self, filename ):
        self.__stream = None
        self.__filename = filename
        return

    def open( self ):
        self.__stream = open( self.__filename, 'w' )
        self.__stream.write( '#EXTM3U\n' )
        return

    def close( self ):
        self.__stream.close()
        self.__stream = None
        return

    def write( self, record: M3URecord ):
        attrs_str = f'tvg-id="{record.TvgId}" tvg-name="{record.TvgName }" tvg-logo="{record.TvgLogo}" group-title="{record.Group}"'
        self.__stream.write( f'#EXTINF:{record.Duration} {attrs_str},{record.Name}\n{record.Link}\n' )
        return

