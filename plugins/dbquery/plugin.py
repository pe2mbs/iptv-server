#
#   Python backend and Angular frontend code generation by gencrud
#   Copyright (C) 2018-2020 Marc Bertens-Nguyen m.bertens@pe2mbs.nl
#
#   This library is free software; you can redistribute it and/or modify
#   it under the terms of the GNU Library General Public License GPL-2.0-only
#   as published by the Free Software Foundation.
#
#   This library is distributed in the hope that it will be useful, but
#   WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
#   Library General Public License for more details.
#
#   You should have received a copy of the GNU Library General Public
#   License GPL-2.0-only along with this library; if not, write to the
#   Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
#   Boston, MA 02110-1301 USA
#
import os
from webapp.common.plugin import Plugin
from plugins.dbquery.connections.component import DBConnectionsComponent
from plugins.dbquery.query.component import DBQueryComponent

__version__     = '1.1.0'
__copyright__   = '(c) Copyright 2018-2021, all rights reserved, GPL2 only'
__author__      = 'Marc Bertens-Nguyen'
__date__        = '2021-01-01'
__module__      = 'dbquery'


class DbQueryPlugin( Plugin ):
    def __init__( self, name, path ):
        Plugin.__init__( self, name, path )
        self.addComponent( DBConnectionsComponent( self ) )
        self.addComponent( DBQueryComponent( self ) )

        self.registerPlugin()
        return

    def getPluginMenu( self ) -> dict:
        return {
            'caption':  'DB-Query',
            'id':       self.createClassId(),
            'icon':     'box-tv',
            'before':   'Administration',
            'after':    'Dashboard',
            'children': self.makeSubMenu()
        }