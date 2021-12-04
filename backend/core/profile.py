import os
import yaml
from flask import jsonify, request
import webapp2.api as API


@API.coreApi.route( '/api/profile/<username>', methods=[ 'GET' ] )
def restoreProfile( username ):
    userProfile = os.path.abspath( os.path.join( '.', '{}.yaml'.format( username ) ) )
    if os.path.isfile( userProfile ):
        with open( userProfile, 'r' ) as stream:
            result = yaml.load( stream, Loader = yaml.Loader )

    else:
        # Needs default profile
        result = {
            'user': username,
            'fullname': 'Administrator',
            'role': 1,
            'roleString': 'Administrator',
            'theme': 'light-theme',
            'locale': 'nl_NL',
            'pageSize': 10,
            'profilePage': None,
            'profileParamaters': None,
            'objects': {}
        }

    API.logger.info( "RESTORE.PROFILE: {}".format( result ) )
    return jsonify( result )

@API.coreApi.route( '/api/profile', methods=[ 'POST' ] )
def storeProfile():
    data = request.json
    userProfile = os.path.abspath( os.path.join( '.', '{}.yaml'.format( data.get( 'user', 'default' ) ) ) )
    API.logger.info( "STORE.PROFILE: {}".format( data ) )
    with open( userProfile, 'w' ) as stream:
        yaml.dump( data, stream, Dumper = yaml.Dumper )

    return jsonify( ok = True )
