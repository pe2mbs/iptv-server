from flask import Blueprint
from webapp2.common.crud import CrudInterface, RecordLock
from plugins.iptv.bougets.model import Bouget
from plugins.iptv.bougets.schema import BougetSchema
from webapp2.common.plugin import Plugin, PluginComponent


class BougetRecordLock( RecordLock ):
    def __init__(self):
        RecordLock.__init__( self, 'bougets', 'B_ID' )
        return


class IptvBougetsComponent( PluginComponent, CrudInterface ):
    _model_cls = Bouget
    _lock_cls = BougetRecordLock
    _schema_cls = BougetSchema()
    _schema_list_cls = BougetSchema( many = True )
    _uri = '/api/bougets'
    _relations = []

    def __init__( self, parent: Plugin ):
        PluginComponent.__init__( self, parent, Blueprint( 'bougetsApi', __name__ ), 'Bougets' )
        CrudInterface.__init__( self, self.flaskBlueprint )
        return

    def beforeUpdate( self, record ):
        for field in ( "B_ID", ):
            if field in record:
                del record[ field ]

        return record

    def getMenuItem( self ) -> dict:
        return {
            'caption':  'Bougets',
            'id':       self.createClassId(),
            'iconv':    'settings',
            'route':    '/bougets',
            'before':   'Channels',
            'after':    None
        }