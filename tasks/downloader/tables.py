from tasks.common.database import *

class IptvChannel( Base ):
    __tablename__   = 'iptv_channel'
    IC_ID           = Column( 'ic_id', Integer, primary_key = True )
    IC_ENABLED      = Column( 'ic_enabled', Boolean, default = True )
    IC_NAME         = Column( 'ic_name', String( 50 ) )
    IC_ALIAS        = Column( 'ic_alias', String( 50 ) )
    IC_COUNTRY      = Column( 'ic_country', String( 2 ) )
    IC_INDEX        = Column( 'ic_index', Integer, nullable = True )
    IC_UPDATE       = Column( 'ic_update', DateTime, nullable = True )
    IC_GROUP        = Column( 'ic_group', String( 50 ) )
    IC_IB_ID        = Column( 'ic_ib_id', Integer, ForeignKey( "iptv_bouget.ib_id" ), nullable=False )
    IC_DURATION     = Column( 'ic_duration', Integer, nullable = True )
    IC_LINK         = Column( 'ic_link', String( 255 ) )
    IC_TVG_ID       = Column( 'ic_tvg_id', String( 50 ) )
    IC_TVG_LOGO     = Column( 'ic_tvg_logo', String )
    IC_TVG_NAME     = Column( 'ic_tvg_name', String( 50 ) )

    def __repr__(self):
        return f"<IptvChannel(name='{self.CH_NAME}', index='{self.CH_INDEX}'"


class IptvBouget( Base ):
    __tablename__   = 'iptv_bouget'
    IB_ID           = Column( 'ib_id', Integer, primary_key = True )
    IB_ENABLED      = Column( 'ib_enabled', Boolean, default = False )
    IB_INDEX        = Column( 'ib_index', Integer, nullable = True )
    IB_NAME         = Column( 'ib_name', String( 100 ) )
    IB_ALIAS        = Column( 'ib_alias', String( 100 ) )
    IB_COUNTRY      = Column( 'ib_country', String( 2 ) )
    IB_UPDATE       = Column( 'ib_update', DateTime, nullable = True )

    def __repr__(self):
        return f"<IptvBouget name='{self.BG_NAME}', enabled={self.BG_ENABLED}>"


class IptvSerie( Base ):
    __tablename__   = 'iptv_serie'
    IS_ID           = Column( 'is_id', Integer, primary_key = True )
    IS_ENABLED      = Column( 'is_enabled', Boolean, default = False )
    IS_INDEX        = Column( 'is_index', Integer, nullable = True )
    IS_NAME         = Column( 'is_name', String( 100 ) )
    IS_COUNTRY      = Column( 'is_country', String( 2 ) )
    IS_UPDATE       = Column( 'is_update', DateTime, nullable = True )

    def __repr__(self):
        return f"<IptvSeries(name='{self.SE_NAME}', enabled={self.SE_ENABLED}>"


class IptvEpisode( Base ):
    __tablename__   = 'iptv_episode'
    IE_ID           = Column( 'ie_id', Integer, primary_key = True )
    IE_NAME         = Column( 'ie_name', String( 50 ) )
    IE_COUNTRY      = Column( 'ie_country', String( 2 ) )
    IE_IS_ID        = Column( 'ie_is_id', Integer, ForeignKey( "iptv_serie.is_id" ), nullable=False )
    IE_SEASON       = Column( 'ie_season', Integer )
    IE_EPISODE      = Column( 'ie_episode', Integer )
    IE_UPDATE       = Column( 'ie_update', DateTime, nullable = True )
    IE_GROUP        = Column( 'ie_group', String( 50 ) )
    IE_DURATION     = Column( 'ie_duration', Integer, nullable = True )
    IE_LINK         = Column( 'ie_link', String( 255 ) )
    IE_TVG_ID       = Column( 'ie_tvg_id', String( 50 ) )
    IE_TVG_LOGO     = Column( 'ie_tvg_logo', String )
    IE_TVG_NAME     = Column( 'ie_tvg_name', String( 50 ) )

    def __repr__(self):
        return f"<IptvSerie(name='{self.IS_NAME}', E{self.IS_SEASON:02d}-S{self.IS_EPISODE:02d}>"


class IptvMovie( Base ):
    __tablename__   = 'iptv_movie'
    IM_ID           = Column( 'im_id', Integer, primary_key = True )
    IM_ENABLED      = Column( 'im_enabled', Boolean, default = False )
    IM_INDEX        = Column( 'im_index', Integer, default = 9999 )
    IM_NAME         = Column( 'im_name', String( 128 ) )
    IM_COUNTRY      = Column( 'im_country', String( 2 ) )
    IM_STITLE       = Column( 'im_stitle', String( 128 )  )
    IM_UPDATE       = Column( 'im_update', DateTime, nullable = True )
    IM_GROUP        = Column( 'im_group', String( 50 ) )
    IM_DURATION     = Column( 'im_duration', Integer, nullable = True )
    IM_LINK         = Column( 'im_link', String( 255 ) )
    IM_TVG_ID       = Column( 'im_tvg_id', String( 50 ) )
    IM_TVG_LOGO     = Column( 'im_tvg_logo', String )
    IM_TVG_NAME     = Column( 'im_tvg_name', String( 50 ) )

    def __repr__(self):
        return f"<IptvMovie(name='{self.IM_NAME}, {self.IM_STITLE}', enabled = {self.IM_ENABLED}>"

class IptvAlias( Base ):
    __tablename__   = 'iptv_alias'
    IA_ID           = Column( 'ia_id', Integer, primary_key = True )
    IA_NAME         = Column( 'ia_name', String( 128 ) )
    IA_ALIAS        = Column( 'ia_alias', String( 128 ) )
    IA_INDEX        = Column( 'ia_index', Integer, nullable = True )

    def __repr__(self):
        return f"<IptvAlias(name='{self.IA_NAME}' alias='{self.IA_ALIAS}'"


class IptvReplace( Base ):
    __tablename__   = 'iptv_replace'
    IR_ID           = Column( 'ir_id', Integer, primary_key = True )
    IR_FIND         = Column( 'ir_find', String( 128 ) )
    IR_REPLACE      = Column( 'ir_replace', String( 128 ) )

    def __repr__(self):
        return f"<IptvReplace(name='{self.IR_FIND}' alias='{self.IR_REPLACE}'"


class IptvConfig( Base ):
    __tablename__   = 'iptv_config'
    CFG_ID           = Column( 'cfg_id', Integer, primary_key = True )
    CFG_ENABLED      = Column( 'cfg_enabled', Boolean, default = False )
    CFG_NAME         = Column( 'cfg_name', String( 50 ) )
    CFG_LOCATION     = Column( 'cfg_location', String( 255 ) )
    CFG_USERNAME     = Column( 'cfg_username', String( 50 ), nullable = True )
    CFG_PASSWORD     = Column( 'cfg_password', String( 50 ), nullable = True )
    CFG_AUTH         = Column( 'cfg_index', Integer, default = 0 )
