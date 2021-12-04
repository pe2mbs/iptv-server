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
#   gencrud: 2021-04-04 08:27:09 version 2.1.680 by user mbertens
#
from flask import Blueprint, request, jsonify
import webapp2.api as API
from webapp2.common.crud import CrudInterface, RecordLock
import traceback
from backend.role_access.model import RoleAccess
from backend.role_access.schema import RoleAccessSchema


role_accessApi = Blueprint( 'role_accessApi', __name__ )


# Args is for downwards compatibility !!!!!
def registerApi( *args ):
    # Set the logger for the users module
    API.app.logger.info( 'Register RoleAccess routes' )
    API.app.register_blueprint( role_accessApi )
    try:
        import backend.role_access.entry_points  as EP
        if hasattr( EP, 'entryPointApi' ):
            API.app.logger.info( 'Register RoleAccess entrypoint routes' )
            API.app.register_blueprint( EP.entryPointApi )

        if hasattr( EP, 'registerWebSocket' ):
            EP.registerWebSocket()

    except ModuleNotFoundError as exc:
        if exc.name != 'backend.role_access.entry_points':
            API.app.logger.error( traceback.format_exc() )

    except Exception:
        API.app.logger.error( traceback.format_exc() )

    # TODO: Here we need to add dynamically the menus for this module
    return



class RoleAccessRecordLock( RecordLock ):
    def __init__(self):
        RecordLock.__init__( self, 'role_access', 'RA_ID' )
        return


class RoleAccessCurdInterface( CrudInterface ):
    _model_cls = RoleAccess
    _lock_cls = RoleAccessRecordLock
    _schema_cls = RoleAccessSchema()
    _schema_list_cls = RoleAccessSchema( many = True )
    _uri = '/api/role_access'
    _relations = []

    def __init__( self ):
        CrudInterface.__init__( self, role_accessApi )
        return

    def beforeUpdate( self, record ):
        for field in ( "RA_ID", "RA_R_ID_FK", "RA_MA_ID_FK", "RA_CREATE_LABEL", "RA_READ_LABEL", "RA_UPDATE_LABEL", "RA_DELETE_LABEL", ):
            if field in record:
                del record[ field ]



        return record


role_access = RoleAccessCurdInterface()

