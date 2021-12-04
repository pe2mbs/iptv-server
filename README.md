# Example demostration Python backend and Angular frontend.

This example project is to show how to use the webapp repository to provide the web server for an Angular frontend application.

This example project is under MIT licence
The webapp repository is under GPL2-only licence.

See for more details the README.md in the webapp folder.

## Start

```bash
export FLASK_APP = webapp/autoapp
export FLASK_DEBUG = 1
export FLASK_ENV = [ DEVELOPMENT | STAGING | PRODUCTION ] 
```

In the config.yaml all the parameters that needs to be there are there.

For development run the webapp as follows:
```bash
flask rundev
```

For staged or production run the webapp as follows:
```bash
flask runprod 
```

or when you need SSL/TLS secured sessions
```bash
flask runssl 
```

	This is not a preferred way of using SSL/TLS with Python Flask, but for simple solutions it can be used.
	A better way is to use NGINX as reverse proxy and let NGINX handle the SSL/TLS termination. Then you can 
	also easily use letscrypt for taking care of the certicates.

## Do it your self
What is missing is the API module where the frontend API calls will be handled. As simple example is shown here

```python
import webapp.api as API
from flask import Blueprint, current_app, session, jsonify

__version__ = '0.1'
__date__    = '02 February 2020'

yourApi = Blueprint( 'yourApi', __name__ )


def registerApi():
    if API.app.config.get( 'ALLOW_CORS_ORIGIN', False ):
        if API.app.config.get( 'ALLOW_CORS_ORIGIN', False ):
            API.app.logger.info( 'Allowing CORS' )
            API.cors.init_app( 'menuApi', origins = API.app.config.get( 'CORS_ORIGIN_WHITELIST', '*' ) )

    API.app.logger.info( 'Register API routes' )
    API.app.register_blueprint( yourApi )
    return


@yourApi.route( "/api/menu", methods=[ 'GET' ] )
def getUserMenu():
    return jsonify( [ { "caption":  "Dashboard",
                        "icon":     "dashboard" 
                        "route":    "/dashboard" }
                    ] )


@yourApi.route( "/api/application", methods=[ 'GET' ] )
def getApplicationInfo():
    return jsonify( {
        'application': 'Your application',
        'version': __version__,
        'ReleaseDate': __date__
    } )


```

After you created the API module, you need to alter the config.yaml file without the extension .py
```yaml
COMMON:
    ...
    API_MODULE: yourfilename 
    ...
```

