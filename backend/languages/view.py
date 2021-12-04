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
#   gencrud: 2021-04-04 08:26:08 version 2.1.680 by user mbertens
#
from flask import Blueprint, request, jsonify
import webapp2.api as API
from webapp2.common.crud import CrudInterface, RecordLock
import traceback
from backend.languages.model import Languages
from backend.languages.schema import LanguagesSchema
from backend.languages.view_mixin import LanguagesViewMixin


languagesApi = Blueprint( 'languagesApi', __name__ )


# Args is for downwards compatibility !!!!!
def registerApi( *args ):
    # Set the logger for the users module
    API.app.logger.info( 'Register Languages routes' )
    API.app.register_blueprint( languagesApi )
    try:
        import backend.languages.entry_points  as EP
        if hasattr( EP, 'entryPointApi' ):
            API.app.logger.info( 'Register Languages entrypoint routes' )
            API.app.register_blueprint( EP.entryPointApi )

        if hasattr( EP, 'registerWebSocket' ):
            EP.registerWebSocket()

    except ModuleNotFoundError as exc:
        if exc.name != 'backend.languages.entry_points':
            API.app.logger.error( traceback.format_exc() )

    except Exception:
        API.app.logger.error( traceback.format_exc() )

    # TODO: Here we need to add dynamically the menus for this module
    return



class LanguagesRecordLock( RecordLock ):
    def __init__(self):
        RecordLock.__init__( self, 'languages', 'LA_ID' )
        return


class LanguagesCurdInterface( CrudInterface, LanguagesViewMixin ):
    _model_cls = Languages
    _lock_cls = LanguagesRecordLock
    _schema_cls = LanguagesSchema()
    _schema_list_cls = LanguagesSchema( many = True )
    _uri = '/api/languages'
    _relations = [{'table': 'LANGUAGE_REFERENCE', 'class': 'LanguageReference', 'cascade': 'delete,all'}]

    def __init__( self ):
        CrudInterface.__init__( self, languagesApi )
        LanguagesViewMixin.__init__( self )
        return

    def beforeUpdate( self, record ):
        for field in ( "LA_ID", ):
            if field in record:
                del record[ field ]

        if hasattr( LanguagesViewMixin, 'beforeUpdate' ):
            record = LanguagesViewMixin.beforeUpdate( self, record )


        return record


languages = LanguagesCurdInterface()

