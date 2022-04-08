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
import webapp.api as API
from webapp.common.dbmem import DbBaseMemory
from webapp.common.crudmixin import CrudModelMixin




class Tracking( API.db.Model, CrudModelMixin ):
    """Model for the tracking table, this is generated by the gencrud.py module
    When modifing the file make sure that you remove the table from the configuration.
    """
    __field_list__       = ['T_ID', 'T_USER', 'T_TABLE', 'T_ACTION', 'T_RECORD_ID', 'T_CHANGE_DATE_TIME', 'T_CONTENTS']
    __tablename__        = 'tracking'
    T_ID                 = API.db.Column( "t_id", API.db.Integer, autoincrement = True, primary_key = True )
    T_USER               = API.db.Column( "t_user", API.db.LONGTEXT, nullable = False )
    T_TABLE              = API.db.Column( "t_table", API.db.LONGTEXT, nullable = False )
    T_ACTION             = API.db.Column( "t_action", API.db.Integer, nullable = False )
    T_RECORD_ID          = API.db.Column( "t_record_id", API.db.Integer, nullable = False )
    T_CHANGE_DATE_TIME   = API.db.Column( "t_change_date_time", API.db.DateTime, nullable = False )
    T_CONTENTS           = API.db.Column( "t_contents", API.db.LONGTEXT, nullable = True )


    def memoryInstance( self ):
        return TrackingMemory( self )


API.dbtables.register( Tracking )


class TrackingMemory( DbBaseMemory ):
    __model_cls__       = Tracking
    __tablename__       = 'tracking'


API.memorytables.register( TrackingMemory )
