from flask import request, jsonify
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import IntegrityError
import webapp2.api as API


class LangTranslateViewMixin( object ):
    def __init__( self ):
        self.registerRoute( '<int:id>', self.recordDelete, methods = [ 'DELETE' ] )
        return

    def recordDelete( self, id, **kwargs ):
        self.checkAuthentication()
        if 'locker' in kwargs:
            locker = kwargs[ 'locker' ]

        else:
            locker = self._lock_cls.locked( int( id ) )

        API.app.logger.debug( 'MIXIN DELETE: {} {} by {}'.format( self._uri, locker.data, locker.user ) )
        record = self._model_cls.query.get( locker.id )
        if self._lock:
            API.recordTracking.delete( self._model_cls.__tablename__,
                                       locker.id,
                                       record.dictionary,
                                       locker.user )

        API.app.logger.debug( 'Deleting record: {}'.format( record ) )
        API.db.session.delete( record )
        API.app.logger.debug( 'Commit delete' )
        message = ''
        try:
            API.db.session.commit()
            result = True

        except IntegrityError:
            message = 'Could not delete due relations still exists'
            result = False

        API.app.logger.debug( 'recordDelete() => {} {}'.format( result, record ) )
        return jsonify( ok = result, reason = message ), 200 if result else 409
