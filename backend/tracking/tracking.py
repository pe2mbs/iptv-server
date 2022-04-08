import json
from datetime import datetime
from webapp.common.jsonenc import JsonEncoder
import webapp.api as API
from backend.tracking.model import Tracking



class RecordTracking( object ):
    INSERT = 1
    UPDATE = 2
    DELETE = 3

    def __init__(self):
        return

    def action( self, action, table, rec_id, record, user ):
        API.logger.debug( "record action: {} => {}".format( action, record ) )
        if isinstance( record, dict ):
            data = json.dumps( record, cls = JsonEncoder )
        else:
            data = record.json

        API.db.session.add( Tracking( T_USER = user,
                                      T_TABLE = table,
                                      T_ACTION = action,
                                      T_RECORD_ID = int( rec_id ),
                                      T_CONTENTS = data,
                                      T_CHANGE_DATE_TIME = datetime.utcnow() ) )
        API.db.session.commit()
        return

    def insert( self, table, rec_id, record_instance, user ):
        API.logger.debug( "record insert( {} )".format( record_instance ) )
        self.action( self.INSERT, table, rec_id, record_instance, user )
        return

    def update( self, table, rec_id, record_instance, user ):
        API.logger.debug( "record update( {} )".format( record_instance ) )
        self.action( self.UPDATE, table, rec_id, record_instance, user )
        return

    def delete( self, table, rec_id, record_instance, user ):
        API.logger.debug( "record delete( {} )".format( record_instance ) )
        self.action( self.DELETE, table, rec_id, record_instance, user )
        return


API.recordTracking = RecordTracking()