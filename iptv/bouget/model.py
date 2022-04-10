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
#   gencrud: 2022-04-10 21:02:17 version 3.0.685 by user mbertens
#
import webapp2.api as API
from webapp2.common.dbmem import DbBaseMemory
from webapp2.common.crudmixin import CrudModelMixin




class Bouget( API.db.Model, CrudModelMixin ):
    """Model for the bouget table, this is generated by the gencrud.py module
    When modifing the file make sure that you remove the table from the configuration.
    """
    __field_list__       = ['IB_ID', 'IB_ENABLED', 'IB_NAME', 'IB_ALIAS', 'IB_INDEX', 'IB_UPDATE', 'IB_LOCALE']
    __tablename__        = 'bouget'
    IB_ID                = API.db.Column( "ib_id", API.db.Integer, autoincrement = True, primary_key = True )
    IB_ENABLED           = API.db.Column( "ib_enabled", API.db.Boolean, default = False )
    IB_NAME              = API.db.Column( "ib_name", API.db.String( 64 ), nullable = False )
    IB_ALIAS             = API.db.Column( "ib_alias", API.db.String( 64 ), nullable = True )
    IB_INDEX             = API.db.Column( "ib_index", API.db.Integer, nullable = True )
    IB_UPDATE            = API.db.Column( "ib_update", API.db.DateTime, nullable = True )
    IB_LOCALE            = API.db.Column( "ib_locale", API.db.String( 5 ), nullable = True )


    def memoryInstance( self ):
        return BougetMemory( self )


API.dbtables.register( Bouget )


class BougetMemory( DbBaseMemory ):
    __model_cls__       = Bouget
    __tablename__       = 'bouget'


API.memorytables.register( BougetMemory )
