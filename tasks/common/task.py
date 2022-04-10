from tasks.common.database import Database
import tasks.api as API
import webapp2.app


def startup( root_folder ):
    webapp2.app.createApp( root_folder, full_start = False )
    webapp2.app.SetApiReferences( API )
    webapp2.app.API.app.app_context().push()
    API.Db = Database( session = webapp2.app.API.db.session )
    return