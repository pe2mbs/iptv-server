import os
import yaml
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import api as API
from werkzeug.routing import BaseConverter
from flask_marshmallow import Marshmallow


def config_load( filename ):
    return yaml.load( filename, Loader = yaml.Loader )


class RegexConverter( BaseConverter ):
    def __init__( self, url_map, *items ):
        super( RegexConverter, self ).__init__( url_map )
        self.regex = items[ 0 ]


def startApp( root_dir ):
    API.app = Flask(__name__)
    env = os.environ[ 'FLASK_ENV' ]

    API.app.config.from_file( os.path.join( root_dir, "config", "{}.yaml".format( env ) ),
                              load = config_load )
    API.db = SQLAlchemy( API.app )
    API.migrate = Migrate( API.app, API.db )
    API.app.url_map.converters[ 'regex' ] = RegexConverter
    API.mm      = Marshmallow()
    if not hasattr( API.mm, 'SQLAlchemySchema' ):
        API.mm.SQLAlchemySchema = API.mm.ModelSchema

    import iptv_db.model

    return API.app
