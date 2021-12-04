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
from webapp2.common.plugin import Plugin
from plugins.iptv.bougets.component import IptvBougetsComponent
from plugins.iptv.channels.component import IptvChannelsComponent
from plugins.iptv.m3u.component import IptvM3uComponent
from plugins.iptv.m3u_attr.component import IptvM3uAttrComponent

__version__     = '1.1.0'
__copyright__   = '(c) Copyright 2018-2020, all rights reserved, GPL2 only'
__author__      = 'Marc Bertens-Nguyen'
__date__        = '2020-01-01'
__module__      = 'iptv'
__dir__         = lambda : [ 'IptvPlugin', 'IptvBougetsComponent' ]


class IptvPlugin( Plugin ):
    def __init__( self, name, path ):
        Plugin.__init__( self, name, path )
        self.addComponent( IptvBougetsComponent( self ) )
        self.addComponent( IptvChannelsComponent( self ) )
        self.addComponent( IptvM3uComponent( self ) )
        self.addComponent( IptvM3uAttrComponent( self ) )
        self.registerPlugin()
        return

    def getPluginMenu( self ) -> dict:
        return {
            'caption':  'IPTV',
            'id':       self.createClassId(),
            'icon':     'box-tv',
            'before':   'Administration',
            'after':    'Dashboard',
            'children': self.makeSubMenu()
        }