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
#   gencrud: 2022-04-10 21:02:18 version 3.0.685 by user mbertens
#
from flask import Blueprint, request, jsonify
import webapp2.api as API
from webapp2.common.crud import CrudInterface, RecordLock
import traceback
from iptv.serie.model import Serie
from iptv.serie.schema import SerieSchema


serieApi = Blueprint( 'serieApi', __name__ )


# Args is for downwards compatibility !!!!!
def registerApi( *args ):
    # Set the logger for the users module
    API.app.logger.info( 'Register Serie routes' )
    API.app.register_blueprint( serieApi )
    try:
        import iptv.serie.entry_points  as EP
        if hasattr( EP, 'entryPointApi' ):
            API.app.logger.info( 'Register Serie entrypoint routes' )
            API.app.register_blueprint( EP.entryPointApi )

        if hasattr( EP, 'registerWebSocket' ):
            EP.registerWebSocket()

    except ModuleNotFoundError as exc:
        if exc.name != 'iptv.serie.entry_points':
            API.app.logger.error( traceback.format_exc() )

    except Exception:
        API.app.logger.error( traceback.format_exc() )

    # TODO: Here we need to add dynamically the menus for this module
    return



class SerieRecordLock( RecordLock ):
    def __init__(self):
        RecordLock.__init__( self, 'serie', 'IS_ID' )
        return


class SerieCurdInterface( CrudInterface ):
    _model_cls = Serie
    _lock_cls = SerieRecordLock
    _schema_cls = SerieSchema()
    _schema_list_cls = SerieSchema( many = True )
    _uri = '/api/serie'
    _relations = []

    def __init__( self ):
        CrudInterface.__init__( self, serieApi )
        return

    def beforeUpdate( self, record ):
        for field in ( "IS_ID", "IS_ENABLED_LABEL", ):
            if field in record:
                del record[ field ]



        return record


serie = SerieCurdInterface()

