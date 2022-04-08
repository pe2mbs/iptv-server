import os
import tasks.api as API
from tasks.downloader.tables import *
from tasks.m3u import M3URecord, M3USerializer
from tasks.common.task import startup


class M3UCreator():
    def __init__( self, filename: str, index_filename = None ):
        self.__stream = M3USerializer( filename )
        self.__index_filename = index_filename
        return

    def create( self ):
        self.__stream.open()
        if self.__index_filename is not None:
            index_stream = open( self.__index_filename, 'w' )

        else:
            index_stream = None

        record = M3URecord()
        for bouget in API.Db.Query( IptvBouget ).filter( IptvBouget.IB_ENABLED ).all():
            if index_stream:
                index_stream.write( f'IPTV: {bouget.IB_NAME}\n' )

            for channel in API.Db.Query( IptvChannel ).filter( bouget.IB_ID == IptvChannel.IC_IB_ID ). \
                                                        order_by( IptvChannel.IC_INDEX, IptvChannel.IC_ID ).all():
                channel: IptvChannel
                record.get( channel )
                self.__stream.write( record )
                if index_stream:
                    index_stream.write( f'    {record.Name}\n' )

                record.clear()

        last = ''
        for movie in API.Db.Query( IptvMovie ).filter( IptvMovie.IM_ENABLED ).order_by( IptvMovie.IM_GROUP, IptvMovie.IM_NAME ).all():
            movie: IptvMovie
            record.get( movie )
            if index_stream:
                if last != record.Group:
                    index_stream.write( f'{record.Group}\n' )
                    last = record.Group

                index_stream.write( f'    {record.Name}\n' )

            self.__stream.write( record )
            record.clear()

        last = ''
        for serie in API.Db.Query( IptvSerie ).filter( IptvSerie.IS_ENABLED ).order_by( IptvSerie.IS_NAME ).all():
            serie: IptvSerie
            if index_stream:
                index_stream.write( f'Serie: {serie.IS_NAME}\n' )

            for episode in API.Db.Query( IptvEpisode ).filter( IptvEpisode.IE_IS_ID == serie.IS_ID ).\
                                                    order_by( IptvEpisode.IE_SEASON, IptvEpisode.IE_EPISODE ).all():
                episode: IptvSerie
                record.get( episode )
                self.__stream.write( record )
                if index_stream:
                    index_stream.write( f'    {record.Name}\n' )

                record.clear()

        if index_stream is not None:
            index_stream.close()

        return


def main():
    startup( '/home/mbertens/src/python/iptv_m3u_server' )
    obj = M3UCreator( os.path.join( API.config.get( 'APP_PATH', '.' ), API.config.get( 'M3U_PATH', 'data/output.m3u' ) ),
                      os.path.join( API.config.get( 'APP_PATH', '.' ), API.config.get( 'TxT_PATH', 'data/output.txt' ) ) )
    obj.create()
    return


if __name__ == '__main__':
    main()