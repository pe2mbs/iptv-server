from sqlalchemy.orm.exc import NoResultFound
import re
import requests
import traceback
import webapp.api as API
from webapp.extensions.database import getDataBase
from backend.models import *        # noqa
from plugins.iptv.models import *

def m3uProcessAttributes( attrs ) -> dict:
    result = {}
    stage = 0
    variable = ''
    value = ''
    for ch in attrs:
        if stage == 0:
            if ch == '=':
                stage = 1

            elif ch == ' ':
                continue

            else:
                variable += ch

        elif stage == 1:
            if ch == '"':
                stage = 3

            else:
                value = ch
                state = 2

        elif stage == 2:
            if ch == ' ':
                if value != "":
                    result[ variable ] = value

                variable = ''
                value = ''
                stage = 0

            else:
                value += ch

        elif stage == 3:
            if ch == '"':
                if value != "":
                    result[ variable ] = value

                variable = ''
                value = ''
                stage = 0

            else:
                value += ch

    return result



def download_m3u( filename_url: str = None, **kwargs ):
    # from plugins.iptv.models import *
    # from plugins.iptv.m3u.model import M3u
    # from plugins.iptv.m3u_attr.model import M3uAttr
    # from plugins.iptv.channels.model import Channel
    # from plugins.iptv.bougets.model import Bouget
    downloaderConfig = API.app.config.get( 'TASK', {} ).get( 'downloader', {} )
    if filename_url is None:
        filename_url = downloaderConfig.get( 'M3U_URL' )

    if filename_url is None:
        raise Exception( "Missing filename or URL for the M3U file" )





    delete_records = kwargs.get( 'delete_records', False )
    if delete_records:
        API.db.session.query( Channel ).update( { Channel.CH_M_ID: None } )
        API.db.session.query( M3uAttr ).delete()
        API.db.session.query( M3uRecord ).delete()
        API.db.session.commit()

    if filename_url.startswith( "http" ):
        r = requests.get( filename_url )
        API.logger.info( "Status: {}".format( r.status_code ) )
        API.logger.info( "Headers: {}".format( r.headers ) )
        API.logger.info( "Encoding: {}".format( r.encoding ) )
        API.logger.info( "Text: {}".format( r.text ) )
        it = iter( r.text.splitlines( keepends = False ) )

    elif filename_url.startswith( "file://" ):
        with open( filename_url[ 7: ], 'r', newline=None ) as stream:
            it = iter( stream.readlines() )

    else:
        print( "unsupported filename_url parameter")
        return

    if not next( it ).startswith( '#EXTM3U' ):
        raise Exception( 'Failed to find #EXTM3U at start of data' )

    entryCounter = 0
    insertCounter = 0
    excludeCounter = 0
    ignoreCounter = 0
    db = getDataBase()
    for line in it:
        try:
            if line.startswith( '#EXTINF:' ):
                entryCounter += 1
                line = line.split( ':', 1 )[ 1 ].replace("\n",'')

                link = next( it ).replace("\n",'')
                attrs, title = line.rsplit( ',', 1 )
                track_duration, attrs = attrs.split( ' ', 1 )
                attrObj: dict = m3uProcessAttributes( attrs )
                if len( includeList ):
                    if attrObj.get( 'group-title', None ) not in includeList:
                        API.logger.warning( "Excluding: {}".format( line ) )
                        excludeCounter += 1
                        continue

                elif len( ignoreList ):
                    if attrObj.get( 'group-title', None ) in ignoreList:
                        API.logger.warning( "Excluding: {}".format( line ) )
                        excludeCounter += 1
                        continue

                API.logger.info( "Title: {}".format( title ) )
                insertCounter += 1
                recM3U = None           # noqa
                if not delete_records:
                    try:
                        recM3U: M3uRecord = db.session.query( M3uRecord ).filter( M3uRecord.M_TITLE == title ).one()
                        recM3U.M_LINK       = link
                        recM3U.M_DURATION   = int( track_duration )

                    except NoResultFound:
                        pass

                    except Exception as exc:
                        API.logger.error( exc )
                        API.logger.error( traceback.format_exc() )
                        break

                if recM3U is None:
                    recM3U = M3uRecord( M_DURATION = int( track_duration ),         # noqa
                                        M_TITLE = title,                            # noqa
                                        M_LINK = link )                             # noqa
                    db.session.add( recM3U )

                db.session.commit()
                for key, value in attrObj.items():
                    record = None               # noqa
                    if not delete_records:
                        try:
                            record: M3uAttr = API.db.session.query( M3uAttr ). \
                                        filter( M3uAttr.MA_M_ID == recM3U.M_ID ).\
                                        filter( M3uAttr.MA_ATTRIBUTE == key ).one()

                            record.MA_VALUE = value

                        except NoResultFound:
                            pass

                        except Exception:
                            API.logger.exception()
                            break

                    if record is None:
                        API.db.session.add( M3uAttr( MA_M_ID             = recM3U.M_ID, # noqa
                                                     MA_ATTRIBUTE        = key,         # noqa
                                                     MA_VALUE            = value ) )    # noqa

                API.db.session.commit()

            else:
                ignoreCounter += 1
                API.logger.warning( "\n{}\n".format( line ) )

        except Exception as exc:
            API.logger.error( exc )
            API.logger.error( traceback.format_exc() )
            # API.logger.exception()
            break

        except BaseException as exc:
            API.logger.error( exc )
            API.logger.error( traceback.format_exc() )
            break

    print( "entryCounter:   {}".format( entryCounter ) )
    print( "excludeCounter: {}".format( excludeCounter ) )
    print( "insertCounter:  {}".format( insertCounter ) )
    print( "ignoreCounter:  {}".format( ignoreCounter ) )
    return


