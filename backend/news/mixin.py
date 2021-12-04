from flask import jsonify
import webapp2.api as API

class NewsMixinInterface( object ):
    # to_zone = gettz('Europe/Amsterdam' )
    def __init__( self ):
        self.registerRoute( 'getnews', self.getNews, { 'methods': [ 'GET' ] } )
        return

    def getNews( self ):
        API.app.logger.debug( 'GET: {}/getnews by {}'.format( self._uri, self._lock_cls().user ) )
        recordList = []
        for record in API.db.session.query( self._model_cls ).all():
            obj = record.dictionary
            if record.N_END_DATE is None:
                obj[ 'N_PERIOD' ] = "({})".format( record.N_START_DATE )

            else:
                obj[ 'N_PERIOD' ] = "({} - {})".format( record.N_START_DATE, record.N_END_DATE )

            recordList.append( obj )

        API.app.logger.debug( 'getNews => count: {}'.format( len( recordList ) ) )
        interval = API.app.config.get( 'TICKER_INTERVAL', 180 )
        return jsonify( N_NEWS = recordList, N_TOTAL_ITEMS = len( recordList ), N_POLL_INTERVAL = interval )
