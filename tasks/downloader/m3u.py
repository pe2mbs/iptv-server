from sqlalchemy.orm.exc import NoResultFound
import requests
import traceback
import api as API


def m3uProcessAttributes( attrs ):
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


def download_m3u( filename_url: str, **kwargs ):
    from iptv_db.model import M3U, M3U_Attribute, Channel
    delete_records = kwargs.get( 'delete_records', False )
    if delete_records:
        API.db.session.query( Channel ).update( c_m3_id = None )
        API.db.session.query( M3U_Attribute ).delete()
        API.db.session.query( M3U ).delete()
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

    for line in it:
        try:
            if line.startswith( '#EXTINF:' ):
                line = line.split( ':', 1 )[ 1 ].replace("\n",'')
                API.logger.debug( line )
                link = next( it ).replace("\n",'')
                attrs, title = line.rsplit( ',', 1 )
                track_duration, attrs = attrs.split( ' ', 1 )

                recM2U = None
                if not delete_records:
                    try:
                        recM2U: M3U = API.db.session.query( M3U ).filter( M3U.m3_title == title ).one()
                        recM2U.m3_link = link
                        recM2U.m3_runtime = int( track_duration )

                    except NoResultFound:
                        pass

                if recM2U is None:
                    recM2U = M3U(
                        m3_runtime = int( track_duration ),
                        m3_title = title,
                        m3_link = link
                    )
                    API.db.session.add( recM2U )

                API.db.session.commit()
                for key, value in m3uProcessAttributes( attrs ).items():
                    record = None
                    if not delete_records:
                        try:
                            record: M3U_Attribute = API.db.session.query( M3U_Attribute ). \
                                        filter( M3U_Attribute.ma_m3u_id == recM2U.m3_id ).\
                                        filter( M3U_Attribute.ma_attribute == key ).one()

                            record.ma_value = value

                        except NoResultFound:
                            pass

                        if record is None:
                            API.db.session.add( M3U_Attribute(
                                ma_m3u_id           = recM2U.m3_id,
                                ma_attribute        = key,
                                ma_value            = value
                            ) )

                API.db.session.commit()

            else:
                API.logger.warning( "\n{}\n".format( line ) )

        except Exception:
            API.logger.exception()
            break
    return