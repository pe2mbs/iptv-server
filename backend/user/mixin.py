import json
import traceback
from flask import jsonify, request
from sqlalchemy.orm.exc import NoResultFound
from datetime import datetime, timedelta
import webapp2.api as API
from backend.user.model import User
import flask_jwt_extended


class UserViewMixin():
    def __init__( self ):
        self.registerRoute( 'profile/<username>', self.restoreProfile, methods = [ 'GET' ] )
        self.registerRoute( 'profile', self.storeProfile, methods = [ 'POST' ] )
        self.registerRoute( 'authenticate', self.getUserAuthenticate, methods = [ 'POST' ] )
        self.registerRoute( 'signup', self.getUserSignup, methods = [ 'POST' ] )
        self.registerRoute( 'logout', self.userLogout, methods = [ 'POST' ] )
        self.registerRoute( 'pagesize', self.pageSize, methods = [ 'GET' ] )
        return

    def userLogout( self ):
        return "", 200

    def pageSize( self ):
        self.checkAuthentication()
        username = flask_jwt_extended.get_jwt_identity()
        userRecord: User = API.db.session.query( User ).filter( User.U_NAME == username ).one()
        return jsonify( pageSize = userRecord.U_LISTITEMS,
                        pageSizeOptions = [ 5, 10, 25, 100 ] )

    def restoreProfile( self, username ):
        self.checkAuthentication()
        if username not in ( '', None, 'undefined' ):
            API.logger.info( "Restore profile for user: {}".format( username ) )
            userRecord: User = API.db.session.query( User ).filter( User.U_NAME == username ).one()
            if userRecord.U_PROFILE is None:
                userRecord.U_PROFILE = ''

            if userRecord.U_PROFILE.startswith( '{' ) and userRecord.U_PROFILE.endswith( '}' ):
                # TODO: This needs to be moved to it own field U_PROFILE
                data = json.loads( userRecord.U_PROFILE )

            else:
                data = { }

            profileData = { 'locale': userRecord.U_LOCALE,
                            'pageSize': userRecord.U_LISTITEMS,
                            'pageSizeOptions': [ 5, 10, 25, 100 ],
                            'user': userRecord.U_NAME,
                            'fullname': "{} {}".format( userRecord.U_FIRST_NAME, userRecord.U_LAST_NAME ),
                            'role': userRecord.U_ROLE,
                            'roleString': userRecord.U_ROLE_FK.R_ROLE,
                            'theme': data.get( 'theme', 'light-theme' ),
                            'objects': data.get( 'objects', { } ),
                            'profilePage': '/user/edit',
                            'profileParameters': { 'id': 'U_ID', 'mode': 'edit', 'value': userRecord.U_ID, } }
            API.logger.info( "RESTORE.PROFILE: {}".format( profileData ) )
        else:
            profileData = { 'locale': 'en_GB',
                            'pageSize': 10,
                            'pageSizeOptions': [ 5, 10, 25, 100 ],
                            'user': 'guest',
                            'fullname': "Guest",
                            'role': 0,
                            'roleString': 'Guest',
                            'theme': 'light-theme', 'objects': { },
                            'profilePage': '', 'profileParameters': {} }

        return jsonify( profileData )


    def storeProfile( self ):
        self.checkAuthentication()
        profileData = request.json
        username = flask_jwt_extended.get_jwt_identity()
        if username not in ( '', None, 'undefined' ):
            API.logger.info( "Store profile for user: {}".format( username ) )
            userRecord: User = API.db.session.query( User ).filter( User.U_NAME == username ).one()
            data = { 'theme': profileData.get( 'theme', 'light-theme' ),
                     'objects': profileData.get( 'objects', { } ) }
            userRecord.U_PROFILE = json.dumps( data )
            API.logger.info( "STORE.PROFILE: {}".format( userRecord.U_PROFILE ) )
            API.db.session.commit()

        else:
            API.logger.error( "Missing username" )

        return jsonify( ok = True )

    JWT_KEY = 'verysecretkey'

    def encodeToken( self, username, userrole, keepsignedin ):
        """
            “exp” (Expiration Time) Claim
            “nbf” (Not Before Time) Claim
            “iss” (Issuer) Claim
            “aud” (Audience) Claim
            “iat” (Issued At) Claim
        """
        if keepsignedin:
            expiration = timedelta( days = 365 )

        else:
            expiration = timedelta( days = 1 )

        # message = { 'username': username,
        #             'userrole': userrole,
        #             'iss': API.app.config.get( 'HOSTNAME', 'http://localhost/' ),
        #             'iat': datetime.utcnow(),
        #             'exp': datetime.utcnow() + expiration }
        API.logger.info( "identity = {}".format( username ) )
        return flask_jwt_extended.create_access_token( identity = username, expires_delta = expiration )
        # return jwt.encode( message, self.JWT_KEY, algorithm = 'HS256' )

    def decodeToken( self, token ):
        try:
            decoded = flask_jwt_extended.decode_token( token )
            API.logger.info( "Decoded TOKEN: {}".format( decoded ) )
            # decoded = jwt.decode( token, self.JWT_KEY, algorithms = [ "HS256" ] )
            return decoded[ 'username' ], decoded[ 'userrole' ]

        except Exception:
            return None, None

        except Exception:
            raise

    def getUserAuthenticate( self ):
        data = request.json
        API.app.logger.info( data )
        if data is None:
            return "Invalid request, missing user data", 500

        username = data.get( 'userid', None )
        passwd = data.get( 'password', None )
        keepsignedin = data.get( 'keepsignedin', False )
        try:
            API.logger.info( "data: {}".format( data ) )
            userRecord: User = API.db.session.query( User ).filter( User.U_NAME == username ).one()
            if userRecord.U_ACTIVE:
                API.app.logger.debug( "User '{}' password '{}' == '{}'".format( username, userRecord.U_HASH_PASSWORD, passwd ) )
                if userRecord.U_HASH_PASSWORD == passwd:
                    return jsonify( result = True, token = self.encodeToken( username,
                                                                             userRecord.U_ROLE,
                                                                             keepsignedin ) )

                else:
                    API.app.logger.error( "User '{}' password verify fail".format( username ) )

            else:
                API.app.logger.error( "User '{}' not active".format( username ) )

        except NoResultFound:
            API.app.logger.error( "User '{}' not found".format( username ) )

        except Exception:
            API.app.logger.error( traceback.format_exc() )

        return jsonify( result = False )

    def getUserSignup( self ):
        data = request.json
        API.app.logger.info( data )
        if data is None:
            return "Invalid request, missing user data", 500

        username = data.get( 'username', None )
        passwd = data.get( 'password', None )
        email = data.get( 'email', None )
        firstname = data.get( 'firstname', None )
        middlename = data.get( 'middlename', None )
        lastname = data.get( 'lastname', None )
        try:
            userRecord: User = API.db.session.query( User ).filter( User.U_NAME == username ).one()
            if userRecord.U_EMAIL == email and userRecord.U_FIRST_NAME == firstname and userRecord.U_LAST_NAME == lastename and userRecord.U_MIDDLE_NAME == middlename:
                # just reset the password
                userRecord.U_HASH_PASSWORD = passwd
                API.db.session.commit()
                return jsonify( result = True )

        except NoResultFound:
            try:
                API.db.session.add( User( U_NAME = username,
                                          U_FIRST_NAME = firstname,
                                          U_LAST_NAME = lastname,
                                          U_MIDDLE_NAME = middlename,
                                          U_EMAIL = email,
                                          U_HASH_PASSWORD = passwd,
                                          U_ROLE = 1,  # Should be the default Role
                                          U_ACTIVE = True,
                                          U_LISTITEMS = 25,
                                          U_LOCALE = 1 ) )  # Should be the default locale
                API.db.session.commit()
                return jsonify( result = True )

            except Exception:
                API.app.logger.error( traceback.format_exc() )

        except Exception:
            API.app.logger.error( traceback.format_exc() )

        return jsonify( result = False )

