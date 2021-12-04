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
import webapp2.api as API
from webapp2.common.dbmem import DbBaseMemory
from webapp2.common.crudmixin import CrudModelMixin




class Role( API.db.Model, CrudModelMixin ):
    """Model for the role table, this is generated by the gencrud.py module
    When modifing the file make sure that you remove the table from the configuration.
    """
    __field_list__       = ['R_ID', 'R_ROLE', 'R_REMARK']
    __tablename__        = 'roles'
    R_ID                 = API.db.Column( "r_id", API.db.Integer, autoincrement = True, primary_key = True )
    R_ROLE               = API.db.Column( "r_role", API.db.String( 255 ), nullable = False )
    R_REMARK             = API.db.Column( "r_remark", API.db.LONGTEXT, nullable = True )


    def memoryInstance( self ):
        return RoleMemory( self )


API.dbtables.register( Role )


class RoleMemory( DbBaseMemory ):
    __model_cls__       = Role
    __tablename__       = 'roles'


API.memorytables.register( RoleMemory )
