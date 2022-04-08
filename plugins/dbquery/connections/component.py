import importlib
import copy
from flask import Blueprint
from webapp.common.crud import CrudInterface, RecordLock
from webapp.common.plugin import Plugin, PluginComponent
from plugins.dbquery.connections.model import Connection
from plugins.dbquery.connections.schema import ConnectionSchema


class ConnectionRecordLock( RecordLock ):
    def __init__(self):
        RecordLock.__init__( self, 'connections', 'C_ID' )
        return


class DBConnectionsComponent( PluginComponent, CrudInterface ):
    _model_cls = Connection
    _lock_cls = ConnectionRecordLock
    _schema_cls = ConnectionSchema()
    _schema_list_cls = ConnectionSchema( many = True )
    _uri = '/api/connections'
    _relations = []

    def __init__( self, parent: Plugin ):
        PluginComponent.__init__( self, parent, Blueprint( 'connectionsApi', __name__ ), 'Connections' )
        CrudInterface.__init__( self, self.flaskBlueprint )
        self.__dataBaseEngines = []
        self.__dataBaseEnginesMap = {}
        # Inspect database engines
        table = [
            { 'label': 'Sqlite',                    'value': 1, 'module': 'sqlite3'             },
            { 'label': 'MySql/MariaDb (mysqldb)',   'value': 2, 'module': 'mysql+mysqldb'       },
            { 'label': 'MySql/MariaDb (pymysql)',   'value': 3, 'module': 'mysql+pymysql'       },
            { 'label': 'Oracle',                    'value': 4, 'module': 'oracle+cx_oracle'    },
            { 'label': 'PostgreSql (psycopg2)',     'value': 5, 'module': 'postgresql+psycopg2' },
            { 'label': 'PostgreSql (pg8000)',       'value': 6, 'module': 'postgresql+pg8000'   },
            { 'label': 'mssql (pyodbc)',            'value': 7, 'module': 'mssql+pyodbc'        },
            { 'label': 'mssql (pymssql)',           'value': 8, 'module': 'mssql+pymssql'       },
        ]
        for ent in table:
            result = self._checkDbLibrary( ent )
            if isinstance( result, dict ):
                self.__dataBaseEngines.append( result )
                self.__dataBaseEnginesMap[ result.get( 'value' ) ] = result
                self.__dataBaseEnginesMap[ result.get( 'label' ) ] = result

        self.registerRoute( 'enginelist', self.dbSelectList, methods = [ 'POST', 'GET' ] )
        return

    @property
    def dbSelectList( self ):
        return [ { 'label': item.get( 'label' ), 'value': item.get( 'value' ) } for item in self.__dataBaseEngines ]

    @property
    def dbEngines( self ):
        return copy.copy( self.__dataBaseEngines )

    def getDbEngine( self, value ):
        return copy.deepcopy( self.__dataBaseEnginesMap[ value ] )

    def _checkDbLibrary( self, data ):
        try:
            module = data.get( 'module' )
            if '+' in module:
                mod = module.split('+')[ 1 ]

            else:
                mod = module

            importlib.import_module( mod )
            return data

        except ModuleNotFoundError:
            pass

        return None

    def beforeUpdate( self, record ):
        for field in ( "C_ID", ):
            if field in record:
                del record[ field ]

        return record

    def getMenuItem( self ) -> dict:
        return {
            'caption':  'Connections',
            'id':       self.createClassId(),
            'iconv':    'settings',
            'route':    '/connections',
            'before':   'Query',
            'after':    None
        }
