import os
import app.server
import api as API
from mako.template import Template
from flask import current_app, send_from_directory

app = app.server.startApp( os.path.dirname( __file__ ) )

def dictToHtml( data ):
    result = "<ul>"
    for key, value in data.items():
        result += "<li>{} := ".format( key )
        if isinstance( value, dict ):
            result += dictToHtml( value )

        else:
            result += str( value )

        result += "</li>"

    return result + "</ul>"


@API.app.route( "/info" )
def info():
    return """<html>
    <body>
        <h1>IPTV SERVER, version 0.1</h1>
        <h2>Configuration</h2>
        {}
    </body>
</html>""".format( dictToHtml( dict( API.app.config ) ) )


@API.app.route( "/version" )
def version():
    return """<html>
    <body>
    <h1>IPTV SERVER, version 0.1</h1>
</body>
</html>"""


ERROR_HTML = """<html>
<head>
    <title>Exception: Angular application is missing // Werkzeug Debugger</title>
    <link rel="stylesheet" href="?__debugger__=yes&amp;cmd=resource&amp;f=style.css" type="text/css">
    <link rel="shortcut icon" href="?__debugger__=yes&amp;cmd=resource&amp;f=console.png">
    <script src="?__debugger__=yes&amp;cmd=resource&amp;f=jquery.js"></script>
    <script src="?__debugger__=yes&amp;cmd=resource&amp;f=debugger.js"></script>
</head>
<body style="background-color: #fff">
    <div class="debugger">
        <h1>webapp Exception</h1>
        <div class="detail">
            <p class="errormsg">Exception: ${ message }</p>
        </div>
        <h2 class="traceback">${ reason }</h2>

        <div class="explanation">
            ${ explanation }
        </div>
    </body>
</html>"""


def renderErrorPage( message, reason = '', explanation = '' ):
    return Template( ERROR_HTML ).render( message = message,
                                          reason = reason,
                                          explanation = explanation )


@API.app.route( r"/<regex('\S+\.(js|scss|css|map)'):path>" )
def angularSource( path ):
    angular_path = current_app.config[ 'ANGULAR_PATH' ]
    env = current_app.config[ 'ENV' ]
    current_app.logger.info( "Angular dist (*.js|*.css|*.scss|*.map) ({}) : {}".format( env, angular_path ) )
    filename = os.path.join( angular_path, path )
    current_app.logger.info( "file: {} exists {}".format( filename, os.path.exists( filename ) )  )
    return send_from_directory( angular_path, path )


@API.app.route( '/' )
def index():
    angular_path = current_app.config[ 'ANGULAR_PATH' ]
    env = current_app.config[ 'ENV' ]
    filename = os.path.join( angular_path, 'index.html' )
    current_app.logger.info( "file: {} exists {}".format( filename, os.path.exists( filename ) )  )
    current_app.logger.info( "Angular dist ({}) : {}".format( env, angular_path ) )
    try:
        if os.path.isdir( angular_path ):
            if os.path.isfile( os.path.join( angular_path, "index.html" ) ):
                return send_from_directory( angular_path, "index.html" )

            current_app.logger.info( "Python says file not found" )
            return renderErrorPage( "Angular application is missing",
                                    "The frontend application was not found at {}".format( angular_path ),
                                    """Correct the ANGULAR_PATH in the configuration
                                     or perform the <pre># ng build</pre> in the frontend folder to
                                     (re-)create the Angular application.
                                     """ )
        else:
            current_app.logger.info( "ANGULAR_PATH incorrect {}.".format( angular_path ) )
            current_app.logger.info( "ANGULAR_PATH incorrect {}.".format( angular_path ) )
            return renderErrorPage( "ANGULAR_PATH incorrect {}.".format( angular_path ),
                                    "The frontend folder was not found {}.".format( angular_path ),
                                    "Correct the ANGULAR_PATH in the configuration." )

    except Exception as exc:
        current_app.logger.error( exc )
        raise





from app.iptv import fileApi
API.app.register_blueprint( fileApi )

from iptv_db.restapi import restApi
API.app.register_blueprint( restApi )