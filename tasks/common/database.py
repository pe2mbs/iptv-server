from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, and_, or_, ForeignKey             # noqa
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker


Base = declarative_base()

#
# class M3UGroup( Base ):
#     __tablename__   = 'm3u_group'
#     mg_id           = Column( Integer, primary_key = True )
#     mg_name         = Column( String( 50 ) )
#     mg_enabled      = Column( Boolean )
#     mg_index        = Column( Integer )
#     mg_serie        = Column( Boolean )
#     mg_update       = Column( DateTime )
#     mg_recent       = Column( Boolean )
#
#     def __repr__(self):
#         return "<M3UGroup(name='{}', index={} enabled='{}', serie='{}' update={}) new={}>".format( self.mg_name,
#                                                                                                    self.mg_index,
#                                                                                                    "yes" if self.mg_enabled else "no",
#                                                                                                    "yes" if self.mg_serie else "no",
#                                                                                                    self.mg_update.strftime( '%Y-%m-%d %H:%M' ),
#                                                                                                    "yes" if self.mg_recent else "no")
#
#
# class M3UChannel( Base ):
#     __tablename__   = 'm3u_channel'
#     mc_id           = Column( Integer, primary_key = True )
#     mc_name         = Column( String( 100 ) )
#     mc_link         = Column( String( 255 ) )
#     mc_tvg_id       = Column( String( 50 ) )
#     mc_tvg_logo     = Column( String( 255 ) )
#     mc_tvg_name     = Column( String( 50 ) )
#     mc_group_title  = Column( String( 50 ) )
#     mc_update       = Column( DateTime )
#
#     def __repr__(self):
#         return "<M3UChannel(name='{}', tvg_id='{}' link={}>".format( self.mc_name, self.mc_tvg_id, self.mc_link )
#
#
# class Channel( Base ):
#     __tablename__   = 'channel'
#     ch_id           = Column( Integer, primary_key = True )
#     ch_name         = Column( String( 50 ) )
#     ch_second_name  = Column( String( 50 ) )
#     ch_index        = Column( Integer, nullable = True )
#     ch_enabled      = Column( Boolean, nullable = True )
#     ch_update       = Column( DateTime, nullable = True )
#
#     def __repr__(self):
#         return "<Channel(name='{}', index='{}'".format( self.ch_name, self.ch_index )


class Database():
    def __init__( self, connect ):
        self.__connect = connect
        self.__engine = create_engine( self.__connect )
        Session = sessionmaker( bind = self.__engine )
        Base.metadata.create_all( self.__engine )
        self.__session = Session()
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