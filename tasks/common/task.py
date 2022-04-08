import os
import logging.config
import logging
from webapp.extensions.config import Config
from tasks.common.database import Database
import tasks.api as API


def startup( root_folder ):
    API.config = Config( root_folder )
    API.config.fromFolder( os.path.join( root_folder, 'config' ) )
    logging.config.dictConfig( API.config.get( 'LOGGING' ) )
    API.logger = logging.getLogger()
    API.Db = Database( API.config.get( 'SQLALCHEMY_DATABASE_URI' ) )
    return