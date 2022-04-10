from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, and_, or_, ForeignKey             # noqa
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker


Base = declarative_base()


class Database():
    def __init__( self, connect = None, session = None ):
        if isinstance( connect, str ):
            self.__connect = connect
            self.__engine = create_engine( self.__connect )
            Session = sessionmaker( bind = self.__engine )
            Base.metadata.create_all( self.__engine )
            self.__session = Session()

        elif session is not None:
            self.__session = session

        return

    @property
    def Session( self ):
        return self.__session

    def Query( self, *args ):
        return self.__session.query( *args )

    def Add( self, obj ):
        return self.__session.add( obj )

    def Commit( self ):
        return self.__session.commit()

    def Rollback( self ):
        return self.__session.rollback()

    def Clone( self, session, table, *args, **kwargs ):
        query = session.query( table )
        for arg in args:
            query = query.filter( arg )

        cnt = 0
        ignore_fields = kwargs.get( 'ignore_fields', [] )
        for record in query.all():
            addrec = table()
            for field in  table.__table__.columns.keys():
                if field in ignore_fields:
                    continue

                setattr( addrec, field, getattr( record, field ) )

            self.__session.add( addrec )
            cnt +=1

        self.__session.commit()
        return cnt
