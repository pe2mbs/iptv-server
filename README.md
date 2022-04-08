# IPTV - M3U - server.
This application collects the M3U file from an IPTV provider, stores the M3U entries in the database.
Through the Bougets and Channels tables the M3U entries to the TV or Media center (Kodi)

The repository is under GPL2-only licence.

## Start

```bash
export FLASK_APP = webapp/autoapp
export FLASK_DEBUG = 1
export FLASK_ENV = [ DEVELOPMENT | STAGING | PRODUCTION ] 
```
In the config/config.yaml all the parameters that needs to be there are there.

For development run the webapp as follows:
```bash
flask serve dev
```

For staged or production run the webapp as follows:
```bash
flask serve prod 
```

## Using
When the application is accessed the application has no data available.  