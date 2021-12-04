import os
import api as API
from tasks.downloader.__main__ import main

url_m3u = 'http://line.uhd-ott.io/get.php?username=A24A03&password=508FA6&type=m3u_plus&output=mpegts'
url_xml_tv = 'http://line.uhd-ott.io/get.php?username=A24A03&password=508FA6&type=m3u&output=mpegts'
filename_m3u = 'file:///home/mbertens/Media/iptv/tv_channels_A24A03_plus.m3u'

if __name__ == '__main__':
    API.rootPath = os.path.abspath( os.path.dirname( __name__ ) )
    main()