import sys
import getopt
import logging
import api as API
from tasks.downloader.m3u import download_m3u

def usage():
    print()


def banner():
    print()


def main():
    logLevels = [
        logging.CRITICAL,
        logging.ERROR,
        logging.WARNING,
        logging.INFO,
        logging.DEBUG,
    ]
    try:
        opts, args = getopt.getopt( sys.argv[1:], "hdv", ["help", "delete"])

    except getopt.GetoptError as err:
        API.logger.exception( "An exception during argument parsing" )
        # print help information and exit:
        print( err )  # will print something like "option -a not recognized"
        usage()
        sys.exit(2)

    deleteRecords = False
    for o, a in opts:
        if o == "-v":
            idx = logLevels.index( API.logger.level )
            try:
                API.logger.setLevel( logLevels[ idx + 1 ] )

            except Exception:
                pass

        elif o in ( "-h", "--help" ):
            usage()
            sys.exit()

        elif o in ( "-d", "--delete" ):
            deleteRecords = True

        else:
            assert False, "unhandled option"

    for arg in args:
        download_m3u( arg, delete_records = deleteRecords )

    return

