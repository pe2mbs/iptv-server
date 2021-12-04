#
#   Python backend and Angular frontend code generation by gencrud
#   Copyright (C) 2018-2021 Marc Bertens-Nguyen m.bertens@pe2mbs.nl
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
#   gencrud: 2021-10-24 19:21:22 version 3.0.685 by user mbertens
#
from flask import Blueprint
from webapp2.common.crud import CrudInterface, RecordLock
from plugins.iptv.m3u.model import M3u
from plugins.iptv.m3u.schema import M3uSchema
from webapp2.common.plugin import Plugin, PluginComponent


class M3uRecordLock( RecordLock ):
    def __init__(self):
        RecordLock.__init__( self, 'm3u', 'M_ID' )
        return


class IptvM3uComponent( PluginComponent, CrudInterface ):
    _model_cls = M3u
    _lock_cls = M3uRecordLock
    _schema_cls = M3uSchema()
    _schema_list_cls = M3uSchema( many = True )
    _uri = '/api/m3u'
    _relations = []

    def __init__( self, parent: Plugin ):
        PluginComponent.__init__( self, parent, Blueprint( 'm3uApi', __name__ ), 'M3u' )
        CrudInterface.__init__( self, self.flaskBlueprint )
        return

    def beforeUpdate( self, record ):
        for field in ( "M_ID" ):
            if field in record:
                del record[ field ]

        return record

    def getMenuItem( self ) -> dict:
        return {
            'caption':  'Media data (m3u)',
            'id':       self.createClassId(),
            'icon':     'settings',
            'route':    '/m3u',
            'before':   None,
            'after':    'Channels'
        }