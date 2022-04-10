from runonce.util import *


def upgrade():
    session = getSession()
    executeListCommands( session,
                     loadDataFile( "config.yaml", __name__ ),
                     "INSERT INTO config ( if_id, if_name, if_enabled, if_auth, if_location ) "
                     "VALUES( :if_id, :if_name, :if_enabled, :if_auth, :if_location )" )
    return



def downgrade():
    return