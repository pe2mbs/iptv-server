import os
import api as API
from flask import send_file, Blueprint

fileApi = Blueprint( 'fileApi', __name__ )
fileLocation    = '/home/mbertens/Media/iptv'
m3uFilename     = 'my_channels_plus.m3u'
xmlTvFilename   = ''

TEMPLATE = "#EXTINF:{runtime} {attrs},{title}\n{link}\n"

def buildM3uFile( filename ):
    from iptv_db.model import Channel, Bouget, M3U, M3U_Attribute
    with open( filename, 'w' ) as stream:
        for record in API.db.session.query( Channel, Bouget, M3U ). \
                join( Bouget, Bouget.b_id == Channel.c_b_id ). \
                join( M3U, M3U.m3_id == Channel.c_m3_id ). \
                order_by( Channel.c_id ).all():

            attrs = []
            for rec in API.db.session.query( M3U_Attribute ).\
                    filter( M3U_Attribute.ma_m3u_id == record.M3U.m3_id ).all():
                if rec.ma_attribute in ( 'tvg-ID', 'tvg-name', 'tvg-logo'  ):
                    attrs.append( '{}="{}"'.format( rec.ma_attribute, rec.ma_value ) )

            # attrs.append( 'tvg-name="{}"'.format( record.Channel.c_name ) )
            attrs.append( 'group-title="{}"'.format( record.Bouget.b_name ) )
            stream.write( TEMPLATE.format( runtime = record.M3U.m3_runtime,
                                           title = record.Channel.c_name,
                                           link = record.M3U.m3_link,
                                           attrs = " ".join( attrs ) ) )

    return

@fileApi.route("/m3u")
def m3uList():
    try:
        # API.app.config[ 'TMP_M3U_FILE' ]

        filename = os.path.abspath( 'test.m3u' )
        print( "Filename: {}".format( filename ) )
        buildM3uFile( filename )
        return send_file( filename, attachment_filename = filename )

    except Exception as e:
        return str( e )


@fileApi.route("/xmltv")
def xmlTv():
    try:
        return send_file( API.app.config[ 'TMP_XMLTV_FILE' ],
                          attachment_filename = m3uFilename )

    except Exception as e:
        return str( e )


def channel2html( records ):
    from iptv_db.model import M3U, M3U_Attribute
    result = '<ul>'
    for record in records:
        if record.Channel.c_enabled:
            result += "<li>{} :: {} || {}".format( record.Channel.c_id,
                                                   record.Channel.c_name,
                                                   record.Bouget.b_name )
            result += '<ul>'
            m3u = API.db.session.query( M3U ).filter( M3U.m3_id == record.Channel.c_m3_id ).one()
            result += '<li>link = {}</li>'.format( m3u.m3_link )
            for attr in API.db.session.query( M3U_Attribute ).filter( M3U_Attribute.ma_m3u_id == record.Channel.c_m3_id ).all():
                result += '<li>{} = {}</li>'.format( attr.ma_attribute, attr.ma_value )
            result += '</ul>'
            result += "</li>"

    return result + '</ul>'


@fileApi.route( "/channels" )
def channels():
    from iptv_db.model import Channel, Bouget
    channelList = channel2html( API.db.session.query( Channel, Bouget ).\
                                join( Bouget, Bouget.b_id == Channel.c_b_id ).\
                                order_by( Channel.c_id ).all() )
    return """<html>
    <body>
        <h1>IPTV SERVER, version 0.1</h1>
        <h2>Channels</h2>
        {}
    </body>
</html>""".format( channelList )


