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
from plugins.iptv.channels.model import Channel
from plugins.iptv.channels.schema import ChannelSchema
from webapp2.common.plugin import Plugin, PluginComponent


class ChannelRecordLock( RecordLock ):
    def __init__(self):
        RecordLock.__init__( self, 'channels', 'CH_ID' )
        return


class IptvChannelsComponent( PluginComponent, CrudInterface ):
    _model_cls = Channel
    _lock_cls = ChannelRecordLock
    _schema_cls = ChannelSchema()
    _schema_list_cls = ChannelSchema( many = True )
    _uri = '/api/channels'
    _relations = []

    def __init__( self, parent: Plugin ):
        PluginComponent.__init__( self, parent, Blueprint( 'channelsApi', __name__ ), 'Channels' )
        CrudInterface.__init__( self, self.flaskBlueprint )
        return

    def beforeUpdate( self, record ):
        for field in ( "CH_ID", "CH_ENABLED_LABEL", "CH_M_ID_FK", "CH_B_ID_FK", ):
            if field in record:
                del record[ field ]


        for field in ( "CH_M_ID", "CH_B_ID", ):
            if field in record and record[ field ] == 0:
                record[ field ] = None

        return record

    def getMenuItem( self ) -> dict:
        return {
            'caption':  'Channels',
            'id':       self.createClassId(),
            'iconv':    'settings',
            'route':    '/channels',
            'before':   'Media data (m3u)',
            'after':    'Bougets'
        }