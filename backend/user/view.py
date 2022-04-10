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
#   gencrud: 2021-04-04 08:26:10 version 2.1.680 by user mbertens
#
from flask import Blueprint, request, jsonify
import webapp2.api as API
from webapp2.common.crud import CrudInterface, RecordLock
import traceback
from backend.user.model import User
from backend.user.schema import UserSchema
from backend.user.mixin import UserViewMixin


userApi = Blueprint( 'userApi', __name__ )


# Args is for downwards compatibility !!!!!
def registerApi( *args ):
    # Set the logger for the users module
    API.app.logger.info( 'Register User routes' )
    API.app.register_blueprint( userApi )
    try:
        import backend.user.entry_points  as EP
        if hasattr( EP, 'entryPointApi' ):
            API.app.logger.info( 'Register User entrypoint routes' )
            API.app.register_blueprint( EP.entryPointApi )

        if hasattr( EP, 'registerWebSocket' ):
            EP.registerWebSocket()

    except ModuleNotFoundError as exc:
        if exc.name != 'backend.user.entry_points':
            API.app.logger.error( traceback.format_exc() )

    except Exception:
        API.app.logger.error( traceback.format_exc() )

    # TODO: Here we need to add dynamically the menus for this module
    return



class UserRecordLock( RecordLock ):
    def __init__(self):
        RecordLock.__init__( self, 'user', 'U_ID' )
        return


class UserCurdInterface( CrudInterface, UserViewMixin ):
    _model_cls = User
    _lock_cls = UserRecordLock
    _schema_cls = UserSchema()
    _schema_list_cls = UserSchema( many = True )
    _uri = '/api/user'
    _relations = []

    def __init__( self ):
        CrudInterface.__init__( self, userApi )
        UserViewMixin.__init__( self )
        return

    def beforeUpdate( self, record ):
        for field in ( "U_ID", "U_ACTIVE_LABEL", "U_ROLE_FK", "U_MUST_CHANGE_LABEL", "U_LISTITEMS_LABEL", ):
            if field in record:
                del record[ field ]

        if hasattr( UserViewMixin, 'beforeUpdate' ):
            record = UserViewMixin.beforeUpdate( self, record )


        return record


user = UserCurdInterface()

