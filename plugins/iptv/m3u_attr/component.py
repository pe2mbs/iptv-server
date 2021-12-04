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
from plugins.iptv.m3u_attr.model import M3uAttr
from plugins.iptv.m3u_attr.schema import M3uAttrSchema
from webapp2.common.plugin import Plugin, PluginComponent


class M3uAttrRecordLock( RecordLock ):
    def __init__(self):
        RecordLock.__init__( self, 'm3u', 'MA_ID' )
        return


class IptvM3uAttrComponent( PluginComponent, CrudInterface ):
    _model_cls = M3uAttr
    _lock_cls = M3uAttrRecordLock
    _schema_cls = M3uAttrSchema()
    _schema_list_cls = M3uAttrSchema( many = True )
    _uri = '/api/m3u'
    _relations = []

    def __init__( self, parent: Plugin ):
        PluginComponent.__init__( self, parent, Blueprint( 'm3uAttrApi', __name__ ), 'M3uAttr' )
        CrudInterface.__init__( self, self.flaskBlueprint )
        return

    def beforeUpdate( self, record ):
        for field in ( "MA_ID", "MA_M_ID_FK" ):
            if field in record:
                del record[ field ]

        for field in ( "MA_M_ID", ):
            if field in record and record[ field ] == 0:
                record[ field ] = None

        return record
