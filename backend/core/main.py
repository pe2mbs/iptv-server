from flask import Blueprint
import webapp2.api as API
from webapp2.common.exceptions import *

API.coreApi = Blueprint( 'coreApi', __name__ )


def handle_core_exception( exc ):
    return exc.description, exc.code


# These modules need to come after the Blueprint
def registerApi( *args, **kwargs ):
    # Set the logger for the users module
    API.app.logger.info( 'Register Core routes' )
    API.app.register_error_handler( InvalidRequestExecption, handle_core_exception )
    API.app.register_error_handler( RecordLockedException, handle_core_exception )
    API.app.register_blueprint( API.coreApi )


    return