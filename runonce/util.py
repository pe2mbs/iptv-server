import os
import logging
import yaml
from alembic import op
from sqlalchemy import orm
from datetime import datetime, timedelta

ADDED_BY_RUNONCE = 'Record was added by runonce'

__all__ = [
    'datetime',
    'timedelta',
    'executeListCommands',
    'loadDataFile',
    'getSession',
    'ADDED_BY_RUNONCE'
]

logger = logging.getLogger( 'flask.app' )
logger.setLevel( logging.DEBUG )
logger.info("TEST")


def getSession():
    bind = op.get_bind()
    return orm.Session( bind = bind )


def executeListCommands( session, records, sql_statement ):
    for record in records:
        session.execute( sql_statement, record )


def getModuleName( revision ):
    if '.' in revision:
        revision = revision.split( '.' )[ -1 ]

    return revision


def loadDataFile( filename, revision ):
    revision = getModuleName( revision )
    logger.debug( "Finding data file: {} for {}".format( filename, revision ) )
    filename = os.path.join( "runonce", "data", revision, filename )
    if not os.path.isfile( filename ):
        logger.debug( "File not found: {} for {}".format( filename, revision ) )
        filename = os.path.join( "runonce", "data", filename )

    if os.path.isfile( filename ):
        logger.debug( "Loading data file: {}".format( filename ) )
        with open( filename, 'r' ) as stream:
            data = yaml.load( stream, yaml.Loader )

        logger.debug( "Loaded {} records".format( len( data ) ) )
        return data

    else:
        print( "File not found: {}".format( filename ) )

    return []
