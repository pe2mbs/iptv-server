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
#   gencrud: 2021-10-24 19:21:17 version 3.0.685 by user mbertens
#
import webapp2.api as API
from webapp2.common.dbmem import DbBaseMemory
from webapp2.common.crudmixin import CrudModelMixin




class Bouget( API.db.Model, CrudModelMixin ):
    """Model for the bougets table, this is generated by the gencrud.py module
    When modifing the file make sure that you remove the table from the configuration.
    """
    __field_list__       = ['B_ID', 'B_LABEL']
    __tablename__        = 'bougets'
    B_ID                 = API.db.Column( "b_id", API.db.Integer, autoincrement = True, primary_key = True )
    B_LABEL              = API.db.Column( "b_label", API.db.String( 30 ), nullable = False )


    def memoryInstance( self ):
        return BougetMemory( self )


API.dbtables.register( Bouget )


class BougetMemory( DbBaseMemory ):
    __model_cls__       = Bouget
    __tablename__       = 'bougets'


API.memorytables.register( BougetMemory )
