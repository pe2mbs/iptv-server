import time
import logging
import datetime
import tasks.api as API
from tasks.common.task import startup
from sqlalchemy import and_
from requests.auth import HTTPBasicAuth, HTTPDigestAuth
from sqlalchemy.orm.exc import NoResultFound
from backend.config.model import Config
from backend.movie.model import Movie
from backend.serie.model import Serie
from backend.episode.model import Episode
from backend.bouget.model import Bouget
from backend.channel.model import Channel
from tasks.m3u import M3UDeserializer, M3URecord, M3uItemType



def main():
    startup( '/home/mbertens/src/python/iptv_m3u_server' )
    startTime = int(time.time())
    kwargs = {}
    config = API.Db.Query( Config ).filter( Config.IF_ENABLED ).one()
    config: Config
    location = config.IF_LOCATION
    if config.IF_AUTH == 1:     # useranem/password in URI
        schema, url = location.split( '://' )
        location = f'{schema}://{config.IF_USERNAME}:{config.IF_PASSWORD}@{url}'

    elif config.IF_AUTH == 2:     # BasicAuth
        kwargs = {
            'auth': HTTPBasicAuth( config.IF_USERNAME, config.IF_PASSWORD )
        }

    elif config.IF_AUTH == 3:     # DigestAuth
        kwargs = {
            'auth': HTTPDigestAuth( config.IF_USERNAME, config.IF_PASSWORD )
        }

    reader = M3UDeserializer( location, **kwargs )
    timeStamp = datetime.datetime.utcnow()
    for record in reader:
        record: M3URecord
        logging.info( record )
        if record.Type == M3uItemType.MOVIE:
            try:
                movie: Movie    = API.Db.Query( Movie ).filter( Movie.IM_NAME == record.Name ).one()
                movie.IM_UPDATE     = timeStamp

            except NoResultFound:
                movie = Movie()
                movie.IM_UPDATE     = timeStamp
                movie.IM_INDEX      = 9999
                record.put( movie )
                API.Db.Add( movie )

            except Exception:
                raise

            if movie.IM_INDEX is None:
                movie.IM_INDEX      = 9999

            API.Db.Commit()

        elif record.Type == M3uItemType.SERIE_EPISODE:
            try:
                serie: Serie    = API.Db.Query( Serie ).filter( Serie.IS_NAME == record.Group ).one()
                serie.IS_UPDATE     = timeStamp

            except NoResultFound:
                serie = Serie()
                serie.IS_UPDATE = timeStamp
                record.put( serie )
                API.Db.Add( serie )
                API.Db.Commit()

            except Exception:
                raise

            if serie.IS_INDEX is None:
                serie.IS_INDEX      = 9999

            try:
                episode: Episode = API.Db.Query( Episode ).filter( and_( Episode.IE_NAME == record.Name,
                                                                         Episode.IE_GROUP == record.Group ) ).one()
                episode.IE_UPDATE   = timeStamp

            except NoResultFound:
                episode = Episode()
                record.put( episode )
                episode.IE_UPDATE   = timeStamp
                episode.IE_IS_ID    = serie.IS_ID
                API.Db.Add( episode )

            except Exception:
                raise

            API.Db.Commit()

        else:   # M3uItemType.IPTV_CHANNEL
            try:
                bouget = API.Db.Query( Bouget ).filter( Bouget.IB_NAME == record.Group ).one()
                bouget.IB_UPDATE    = timeStamp

            except NoResultFound:
                bouget = Bouget()
                bouget.IB_UPDATE    = timeStamp
                bouget.IB_INDEX     = 9999
                record.put( bouget )
                API.Db.Add( bouget )
                API.Db.Commit()

            except Exception:
                raise

            try:
                channel: Channel = API.Db.Query( Channel ).filter( and_( Channel.IC_NAME == record.Name,
                                                                         Channel.IC_IB_ID == bouget.IB_ID ) ).one()
                channel.IC_UPDATE   = timeStamp
                channel.IC_NAME     = record.Name
                if channel.IC_INDEX is None:
                    channel.IC_INDEX    = 9999

            except NoResultFound:
                channel = Channel()
                record.put( channel )
                channel.IC_IB_ID    = bouget.IB_ID
                channel.IC_UPDATE   = timeStamp
                channel.IC_INDEX    = 9999
                channel.IC_ENABLED  = True
                API.Db.Add( channel )

            except Exception:
                raise

            API.Db.Commit()

    endTime = time.strftime('%H:%M:%S', time.gmtime(int( time.time() - startTime )))
    logging.info( f'{endTime} elapsed' )
    return


if __name__ == '__main__':
    try:
        main()

    except:
        logging.exception( "Exception is code" )

