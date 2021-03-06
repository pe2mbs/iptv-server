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




class Movie( API.db.Model, CrudModelMixin ):
    """Model for the movie table, this is generated by the gencrud.py module
    When modifing the file make sure that you remove the table from the configuration.
    """
    __field_list__       = ['IM_ID', 'IM_ENABLED', 'IM_NAME', 'IM_STITLE', 'IM_GROUP', 'IM_INDEX', 'IM_UPDATE', 'IM_DURATION', 'IM_LINK', 'IM_TVG_ID', 'IM_TVG_LOGO', 'IM_TVG_NAME', 'IM_TVG_ATTR', 'IM_LOCALE']
    __tablename__        = 'movie'
    IM_ID                = API.db.Column( "im_id", API.db.Integer, autoincrement = True, primary_key = True )
    IM_ENABLED           = API.db.Column( "im_enabled", API.db.Boolean, default = False )
    IM_NAME              = API.db.Column( "im_name", API.db.String( 64 ), nullable = False )
    IM_STITLE            = API.db.Column( "im_stitle", API.db.String( 128 ), nullable = True )
    IM_GROUP             = API.db.Column( "im_group", API.db.String( 64 ), nullable = False )
    IM_INDEX             = API.db.Column( "im_index", API.db.Integer, default = 9999 )
    IM_UPDATE            = API.db.Column( "im_update", API.db.DateTime, nullable = True )
    IM_DURATION          = API.db.Column( "im_duration", API.db.Integer, nullable = True )
    IM_LINK              = API.db.Column( "im_link", API.db.String( 255 ), nullable = False )
    IM_TVG_ID            = API.db.Column( "im_tvg_id", API.db.String( 64 ), nullable = True )
    IM_TVG_LOGO          = API.db.Column( "im_tvg_logo", API.db.LONGTEXT, nullable = True )
    IM_TVG_NAME          = API.db.Column( "im_tvg_name", API.db.String( 64 ), nullable = True )
    IM_TVG_ATTR          = API.db.Column( "im_tvg_attr", API.db.LONGTEXT, nullable = True )
    IM_LOCALE            = API.db.Column( "im_locale", API.db.String( 5 ), nullable = True )


    def memoryInstance( self ):
        return MovieMemory( self )


API.dbtables.register( Movie )


class MovieMemory( DbBaseMemory ):
    __model_cls__       = Movie
    __tablename__       = 'movie'


API.memorytables.register( MovieMemory )
