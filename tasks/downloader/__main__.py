import os
import sys
import getopt
import logging
import webapp.api as API
from tasks.downloader.m3u_old import download_m3u
from webapp.app import createApp, SetApiReferences
from webapp.extensions.database import getDataBase


def usage():
    print()


def banner():
    print()


def main( **kwargs ):
    logLevels = [
        logging.CRITICAL,
        logging.ERROR,
        logging.WARNING,
        logging.INFO,
        logging.DEBUG,
    ]
    API.rootPath    = kwargs.get( 'root_path' )
    try:
        opts, args = getopt.getopt( sys.argv[1:], "hdvc:", [ "help", "delete", "config=" ] )

    except getopt.GetoptError as err:
        API.logger.exception( "An exception during argument parsing" )
        # print help information and exit:
        print( err )  # will print something like "option -a not recognized"
        usage()
        sys.exit(2)

    deleteRecords = False
    configFile = None
    verbose = False
    for o, a in opts:
        if o == "-v":
            idx = logLevels.index( API.logger.level )
            verbose = True
            try:
                API.logger.setLevel( logLevels[ idx + 1 ] )

            except Exception:
                pass

        elif o in ( "-h", "--help" ):
            usage()
            sys.exit()

        elif o in ( "-c", "--config" ):
            configFile = os.path.abspath( a )

        elif o in ( "-d", "--delete" ):
            deleteRecords = True

        else:
            assert False, "unhandled option"

    print( "Loading config {}".format( configFile ) )
    API.app = createApp( API.rootPath,
                         configFile,
                         full_start = False,
                         verbose = verbose,
                         process_name = os.environ.get( 'FLASK_TASK', 'webapp' ) )
    SetApiReferences( API )
    API.logger = logging.getLogger( 'Downloader' )
    API.logger.info( 'Downloader starting' )
    # Initialize the main thread database connection
    getDataBase( API.app )
    API.app.app_context().push()

    for arg in args:
        download_m3u( arg, delete_records = deleteRecords )

    else:
        download_m3u( delete_records = deleteRecords )

    return

