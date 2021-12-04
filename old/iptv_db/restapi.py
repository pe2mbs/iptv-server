import os
import time
import api as API
from flask import send_file, Blueprint, request, Response, Request, jsonify
from sqlalchemy import and_, not_
from werkzeug.exceptions import HTTPException
from datetime import date, timedelta, datetime
from sqlalchemy.orm import Query
from iptv_db.model import M3U, M3U_Attribute, Bouget, Channel, channelSchema, channelsSchema

restApi = Blueprint( 'restApi', __name__ )


class InvalidRequestExecption( HTTPException ):
    code = 412
    description = 'Invalid request, missing Record'


def getDictFromRequest( request ):
    try:
        data = request.json

    except Exception:
        data = None

    if data is None:
        data = request.args

    if data is None:
        raise InvalidRequestExecption()

    return data


def render_query(statement, dialect=None):
    """
    Generate an SQL expression string with bound parameters rendered inline
    for the given SQLAlchemy statement.
    WARNING: This method of escaping is insecure, incomplete, and for debugging
    purposes only. Executing SQL statements with inline-rendered user values is
    extremely insecure.
    Based on http://stackoverflow.com/questions/5631078/sqlalchemy-print-the-actual-query
    """
    if isinstance(statement, Query):
        if dialect is None:
            dialect = statement.session.bind.dialect

        statement = statement.statement

    elif dialect is None:
        dialect = statement.bind.dialect

    class LiteralCompiler(dialect.statement_compiler):

        def visit_bindparam(self, bindparam, within_columns_clause=False,
                            literal_binds=False, **kwargs):
            return self.render_literal_value(bindparam.value, bindparam.type)

        def render_array_value(self, val, item_type):
            if isinstance(val, list):
                return "{%s}" % ",".join([self.render_array_value(x, item_type) for x in val])

            return self.render_literal_value(val, item_type)

        def render_literal_value(self, value, type_):
            if isinstance(value, int):
                return str(value)

            elif isinstance(value, (str, date, datetime, timedelta)):
                return "'%s'" % str(value).replace("'", "''")

            elif isinstance(value, list):
                return "'{%s}'" % (",".join([self.render_array_value(x, type_.item_type) for x in value]))

            return super(LiteralCompiler, self).render_literal_value(value, type_)

    return LiteralCompiler(dialect, statement).process(statement)

class RestApiBase():
    _model_cls = None
    _schema_cls = None
    _schema_list_cls = None
    _uri = ''

    def getPagedList( self ):
        t1 = time.time()
        data = getDictFromRequest( request )
        API.app.logger.debug( 'POST: {}/pagedlist'.format( self._uri ) )
        filter = data.get( 'filters', [] )
        API.app.logger.debug( "Filter {}".format( filter ) )
        query = API.db.session.query( self._model_cls )
        for item in filter:
            operator = item.get( 'operator', None )
            if operator is None:
                continue

            column  = item.get( 'column', None )
            value1, value2   = item.get( 'value', [ None, None ] )
            API.app.logger.debug( "Filter {} {} {} / {}".format( column, operator, value1, value2 ) )
            if operator == 'EQ':
                query = query.filter( getattr( self._model_cls, column ) == value1 )

            elif operator == '!EQ':
                query = query.filter( getattr( self._model_cls, column ) != value1 )

            elif operator == 'GT':
                query = query.filter( getattr( self._model_cls, column ) > value1 )

            elif operator == 'LE':
                query = query.filter( getattr( self._model_cls, column ) < value1 )

            elif operator == 'GT|EQ':
                query = query.filter( getattr( self._model_cls, column ) >= value1 )

            elif operator == 'LE|EQ':
                query = query.filter( getattr( self._model_cls, column ) <= value1 )

            elif operator == 'EM':
                query = query.filter( getattr( self._model_cls, column ) == "" )

            elif operator == '!EM':
                query = query.filter( getattr( self._model_cls, column ) != "" )

            elif operator == 'CO':
                query = query.filter( getattr( self._model_cls, column ).like( "%{}%".format( value1 ) ) )

            elif operator == '!CO':
                query = query.filter( not_( getattr( self._model_cls, column ).contains( value1 ) ) )

            elif operator == 'BT': # Between
                query = query.filter( getattr( self._model_cls, column ).between( value1, value2 ) )

            elif operator == 'SW': # Startswith
                query = query.filter( getattr( self._model_cls, column ).like( "{}%".format( value1 ) ) )

            elif operator == 'EW': # Endswith
                query = query.filter( getattr( self._model_cls, column ).like( "%{}".format( value1 ) ) )

        API.app.logger.debug( "SQL-QUERY : {}".format( render_query( query ) ) )
        recCount = query.count()
        API.app.logger.debug( "SQL-QUERY count {}".format( recCount ) )
        sorting = data.get( 'sorting', None )
        if isinstance( sorting, dict ):
            column = sorting.get( 'column', None )
            if column is not None:
                if sorting.get( 'direction', 'asc' ) == 'asc':
                    query = query.order_by( getattr( self._model_cls, column ) )

                else:
                    query = query.order_by( getattr( self._model_cls, column ).desc() )

        pageIndex = int( data.get( 'pageIndex', 0 ) )
        pageSize = int( data.get( 'pageSize', 1 ) )
        API.app.logger.debug( "SQL-QUERY limit {} / {}".format( pageIndex, pageSize ) )
        if ( ( pageIndex * pageSize ) > recCount ):
            pageIndex = 0

        query = query.limit( pageSize ).offset( pageIndex * pageSize )
        result: Response = self._schema_list_cls.jsonify( query.all() )
        API.app.logger.debug( "RESULT count {} => {}".format( recCount, result.json ) )
        result = jsonify(
            records = result.json,
            pageSize = pageSize,
            page = pageIndex,
            recordCount = recCount
        )
        API.app.logger.debug( 'filteredList => {}'.format( result ) )
        return result



class Channels( RestApiBase ):
    _model_cls = Channel
    _schema_cls = channelSchema
    _schema_list_cls = channelsSchema
    _uri = '/api/get/channels'



channels = Channels()


@restApi.route( '/api/get/channels' )
def getChannels():
    API.app.logger.info( "args : {}".format( request.args ) )
    API.app.logger.info( "json : {}".format( request.json ) )
    API.app.logger.info( "data : {}".format( request.data ) )
    # API.app.logger.info( "text : {}".format( dir( request ) ) )
    return channels.getPagedList(), 200

