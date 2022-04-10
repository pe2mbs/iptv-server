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




class Config( API.db.Model, CrudModelMixin ):
    """Model for the config table, this is generated by the gencrud.py module
    When modifing the file make sure that you remove the table from the configuration.
    """
    __field_list__       = ['IF_ID', 'IF_ENABLED', 'IF_NAME', 'IF_LOCATION', 'IF_USERNAME', 'IF_PASSWORD', 'IF_AUTH']
    __tablename__        = 'config'
    IF_ID                = API.db.Column( "if_id", API.db.Integer, autoincrement = True, primary_key = True )
    IF_ENABLED           = API.db.Column( "if_enabled", API.db.Boolean, default = False )
    IF_NAME              = API.db.Column( "if_name", API.db.String( 50 ), nullable = False )
    IF_LOCATION          = API.db.Column( "if_location", API.db.String( 255 ), nullable = False )
    IF_USERNAME          = API.db.Column( "if_username", API.db.String( 50 ), nullable = True )
    IF_PASSWORD          = API.db.Column( "if_password", API.db.String( 50 ), nullable = True )
    IF_AUTH              = API.db.Column( "if_auth", API.db.Integer, default = 0 )


    def memoryInstance( self ):
        return ConfigMemory( self )


API.dbtables.register( Config )


class ConfigMemory( DbBaseMemory ):
    __model_cls__       = Config
    __tablename__       = 'config'


API.memorytables.register( ConfigMemory )