import sys
import logging
import traceback
import requests
from lxml import etree
import tasks.api as API
from requests.auth import HTTPBasicAuth, HTTPDigestAuth, AuthBase
from sqlalchemy.orm.exc import NoResultFound
from tasks.downloader.database import Database, Channel, and_, or_
from tasks.downloader.util import normalizeChannelName


logger = logging.getLogger()


def istype( var, _type ):
    return type( var ) == _type


class Epg():
    def __init__( self, url ):
        self.__url = url
        return

    def getEpg( self, **kwargs ) -> bool:
        if self.__url is None:
            return False

        try:
            if 'user' in kwargs and 'password' in kwargs:
                method = HTTPDigestAuth
                if 'auth_method' in kwargs:
                    if kwargs[ 'auth_method' ].lower() == 'basic':
                        method = HTTPBasicAuth

                    elif kwargs[ 'auth_method' ].lower() == 'digest':
                        method = HTTPDigestAuth

                    else:
                        raise Exception( "Invalid 'autho_method'" )

                elif 'auth' in kwargs and istype( kwargs[ 'auth' ], AuthBase ):
                    method = kwargs[ 'auth' ]

                else:
                    API.logger.warning( "'auth_method' or 'auth' missing, using 'HTTPDigestAuth' as authentication method" )

                del kwargs[ 'auth_method' ]
                kwargs[ 'auth' ] = method( kwargs[ 'user' ], kwargs[ 'password' ] )
                del kwargs[ 'user' ]
                del kwargs[ 'password' ]

            elif 'auth' in kwargs and isinstance( kwargs[ 'auth' ], AuthBase ):
                pass

            else:
                raise Exception( "'auth' missing, using 'HTTPDigestAuth' as authentication method" )

            r = requests.get( self.__url, **kwargs )
            if r.status_code != 200:
                return ( False )

            parser = etree.XMLParser( encoding = r.encoding )
            root = etree.XML( r.text.encode( r.encoding, errors = 'replace' ), parser )
            for item in root.findall( './/channel/display-name' ):
                name =  item.text.strip()
                if name.lower().startswith( 'astra' ) or 'radio' in name.lower() or name.endswith('CZ') or name.isdigit():
                    continue

                logger.info( f"Channel name: '{name}'" )
                try:
                    rec = API.Db.Query( Channel ).filter( Channel.ch_name == name ).one()
                    rec: Channel
                    if rec.ch_name != normalizeChannelName( rec.ch_second_name ):
                        logger.info( f"Secondary channel name: '{rec.ch_second_name}'" )

                except NoResultFound:
                    if name.endswith( ' HEVC' ):
                        ch_second_name = normalizeChannelName( name[:-5].strip() )
                        logger.info( f"Secondary channel name: '{ch_second_name}'" )

                    elif name.endswith( ' HD' ):
                        ch_second_name = normalizeChannelName( name[:-3].strip() )
                        logger.info( f"Secondary channel name: '{ch_second_name}'" )

                    else:
                        ch_second_name = name

                    API.Db.Session.add( Channel( ch_name = name, ch_second_name = ch_second_name ) )

            API.Db.Session.commit()
            return True

        except Exception:
            API.Db.Session.rollback()
            logger.error( traceback.format_exc() )

        return False


def test():
    logging.basicConfig( level = logging.INFO, stream = sys.stdout )
    API.Db = Database( '/home/mbertens/src/python/iptv_m3u_server/data/test1.db' )
    obj = Epg( 'http://home:5701mb@turbo:9981/xmltv/channels' )
    obj.getEpg( user = 'home', password = '5701mb', auth_method = 'digest')


if __name__ == '__main__':
    test()