import os
import tasks.api as API
from tasks.m3u import M3URecord, M3USerializer
from tasks.common.task import startup
from backend.bouget.model import Bouget
from backend.channel.model import Channel
from backend.movie.model import Movie
from backend.serie.model import Serie
from backend.episode.model import Episode

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
        for bouget in API.Db.Query( Bouget ).filter( Bouget.IB_ENABLED ).all():
            if index_stream:
                index_stream.write( f'IPTV: {bouget.IB_NAME}\n' )

            for channel in API.Db.Query( Channel ).filter( bouget.IB_ID == Channel.IC_IB_ID ). \
                                                        order_by( Channel.IC_INDEX, Channel.IC_ID ).all():
                channel: Channel
                record.get( channel )
                self.__stream.write( record )
                if index_stream:
                    index_stream.write( f'    {record.Name}\n' )

                record.clear()

        last = ''
        for movie in API.Db.Query( Movie ).filter( Movie.IM_ENABLED ).order_by( Movie.IM_GROUP, Movie.IM_NAME ).all():
            movie: Movie
            record.get( movie )
            if index_stream:
                if last != record.Group:
                    index_stream.write( f'{record.Group}\n' )
                    last = record.Group

                index_stream.write( f'    {record.Name}\n' )

            self.__stream.write( record )
            record.clear()

        last = ''
        for serie in API.Db.Query( Serie ).filter( Serie.IS_ENABLED ).order_by( Serie.IS_NAME ).all():
            serie: Serie
            if index_stream:
                index_stream.write( f'Serie: {serie.IS_NAME}\n' )

            for episode in API.Db.Query( Episode ).filter( Episode.IE_IS_ID == serie.IS_ID ).\
                                                    order_by( Episode.IE_SEASON, Episode.IE_EPISODE ).all():
                episode: Episode
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