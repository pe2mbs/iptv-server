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
import webapp2.api as API
from webapp2.common.dbmem import DbBaseMemory
from webapp2.common.crudmixin import CrudModelMixin




class Serie( API.db.Model, CrudModelMixin ):
    """Model for the serie table, this is generated by the gencrud.py module
    When modifing the file make sure that you remove the table from the configuration.
    """
    __field_list__       = ['IS_ID', 'IS_ENABLED', 'IS_NAME', 'IS_INDEX', 'IS_LOCALE', 'IS_UPDATE']
    __tablename__        = 'serie'
    IS_ID                = API.db.Column( "is_id", API.db.Integer, autoincrement = True, primary_key = True )
    IS_ENABLED           = API.db.Column( "is_enabled", API.db.Boolean, default = False )
    IS_NAME              = API.db.Column( "is_name", API.db.String( 64 ), nullable = False )
    IS_INDEX             = API.db.Column( "is_index", API.db.Integer, nullable = True )
    IS_LOCALE            = API.db.Column( "is_locale", API.db.String( 5 ), nullable = True )
    IS_UPDATE            = API.db.Column( "is_update", API.db.DateTime, nullable = True )


    def memoryInstance( self ):
        return SerieMemory( self )


API.dbtables.register( Serie )


class SerieMemory( DbBaseMemory ):
    __model_cls__       = Serie
    __tablename__       = 'serie'


API.memorytables.register( SerieMemory )
