import importlib
import copy
from flask import Blueprint
from webapp.common.plugin import Plugin, PluginComponent


class DBQueryComponent( PluginComponent ):
    _uri = '/api/dbquery'

    def __init__( self, parent: Plugin ):
        PluginComponent.__init__( self, parent, Blueprint( 'dbQueryApi', __name__ ), 'Query' )

        return

