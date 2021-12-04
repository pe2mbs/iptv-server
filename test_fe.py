import time
import requests

def test( url ):
    while True:
        print( 'Trying to connect {}'.format( url ) )
        try:
            r = requests.get( url, timeout=5, verify=False )

            if r.status_code == 200:
                print( "OK response" )
                print( r.headers )
                print( r.text )
                break

            else:
                print( "ERROR {}".format( r.status_code ) )

        except requests.exceptions.ConnectTimeout as err:
            print( "Timeout: {}".format( err ) )

        except requests.exceptions.HTTPError as err:
            print( "Error: {}".format( err ) )

        print( 'sleeping...' )
        time.sleep( 5 )

    return

if __name__ == '__main__':
    url = 'http://www.pe2mbs.nl'
    # url = 'http://turbo.pe2mbs.nl:5000'
    test( url )