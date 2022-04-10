from flask import jsonify
import webapp2.api as API


__version__     = '0.0.0'
__date__        = '1970-01-01'
__copyright__   = '(c) Copyright 2018-2020, all rights reserved, GPL2 only'
__author__      = 'Marc Bertens-Nguyen'


applicInfo = {
        'application': 'demo Angular web application',
        'logo': 'assets/images/logo.png',
        'version': __version__,
        'ReleaseDate': __date__,
        'plugins': []
    }


@API.coreApi.route( "/api/application/version", methods=[ 'GET' ] )
def getAppVersion():
    return __version__


@API.coreApi.route( "/api/application/copyright", methods=[ 'GET' ] )
def getAppCopyright():
    return __copyright__


@API.coreApi.route( "/api/application/author", methods=[ 'GET' ] )
def getAppAuthor():
    return __author__


@API.coreApi.route( "/api/application/info", methods=[ 'GET' ] )
def getApplicationInfo():
    return jsonify( applicInfo )


