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
from marshmallow import fields, pre_load, post_dump
from webapp2.common.convert import value2Label, utcDateString2Local


class MovieSchema( API.mm.SQLAlchemySchema ):
    """Schema for the movie table, this is generated by the gencrud.py module
    When modifing the file make sure that you remove the table from the configuration.
    """
    IM_ID    = fields.Integer()
    IM_ENABLED    = fields.Boolean()
    IM_NAME    = fields.String()
    IM_STITLE    = fields.String()
    IM_GROUP    = fields.String()
    IM_INDEX    = fields.Integer()
    IM_UPDATE    = fields.DateTime()
    IM_DURATION    = fields.Integer()
    IM_LINK    = fields.String()
    IM_TVG_ID    = fields.String()
    IM_TVG_LOGO    = fields.String()
    IM_TVG_NAME    = fields.String()
    IM_TVG_ATTR    = fields.String()
    IM_LOCALE    = fields.String()

    __field_set__ = {
        'IM_ID': 0,
        'IM_ENABLED': 0,
        'IM_NAME': '',
        'IM_STITLE': '',
        'IM_GROUP': '',
        'IM_INDEX': 0,
        'IM_UPDATE': '',
        'IM_DURATION': 0,
        'IM_LINK': '',
        'IM_TVG_ID': '',
        'IM_TVG_LOGO': '',
        'IM_TVG_NAME': '',
        'IM_TVG_ATTR': '',
        'IM_LOCALE': '',
    }

    @post_dump
    def post_dump_process( self, in_data, **kwargs ):
        for field, default in self.__field_set__.items():
            if in_data[ field ] is None:
                in_data[ field ] = default

        in_data[ 'IM_ENABLED_LABEL' ] = value2Label( {True: 'Yes', False: 'No'}, in_data[ 'IM_ENABLED' ] )
        return in_data

    @pre_load
    def pre_load_process( self, out_data, **kwargs ):
        out_data[ 'IM_UPDATE' ] = utcDateString2Local( out_data[ 'IM_UPDATE' ], '%Y-%m-%d %H:%M:%S' )
        return out_data


movieSchema   = MovieSchema()
moviesSchema  = MovieSchema( many = True )

