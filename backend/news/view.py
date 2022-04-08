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
#   gencrud: 2021-04-04 08:26:09 version 2.1.680 by user mbertens
#
from flask import Blueprint, request, jsonify
import webapp.api as API
from webapp.common.crud import CrudInterface, RecordLock
import traceback
from backend.news.model import News
from backend.news.schema import NewsSchema
from backend.news.mixin import NewsMixinInterface


newsApi = Blueprint( 'newsApi', __name__ )


# Args is for downwards compatibility !!!!!
def registerApi( *args ):
    # Set the logger for the users module
    API.app.logger.info( 'Register News routes' )
    API.app.register_blueprint( newsApi )
    try:
        import backend.news.entry_points  as EP
        if hasattr( EP, 'entryPointApi' ):
            API.app.logger.info( 'Register News entrypoint routes' )
            API.app.register_blueprint( EP.entryPointApi )

        if hasattr( EP, 'registerWebSocket' ):
            EP.registerWebSocket()

    except ModuleNotFoundError as exc:
        if exc.name != 'backend.news.entry_points':
            API.app.logger.error( traceback.format_exc() )

    except Exception:
        API.app.logger.error( traceback.format_exc() )

    # TODO: Here we need to add dynamically the menus for this module
    return



class NewsRecordLock( RecordLock ):
    def __init__(self):
        RecordLock.__init__( self, 'news', 'N_ID' )
        return


class NewsCurdInterface( CrudInterface, NewsMixinInterface ):
    _model_cls = News
    _lock_cls = NewsRecordLock
    _schema_cls = NewsSchema()
    _schema_list_cls = NewsSchema( many = True )
    _uri = '/api/news'
    _relations = []

    def __init__( self ):
        CrudInterface.__init__( self, newsApi )
        NewsMixinInterface.__init__( self )
        return

    def beforeUpdate( self, record ):
        for field in ( "N_ID", "N_ACTIVE_LABEL", "N_ALERT_LABEL", "N_KEEP_LABEL", ):
            if field in record:
                del record[ field ]

        if hasattr( NewsMixinInterface, 'beforeUpdate' ):
            record = NewsMixinInterface.beforeUpdate( self, record )


        return record


news = NewsCurdInterface()

