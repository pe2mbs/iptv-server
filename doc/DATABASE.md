# Application user
CREATE USER 'iptv_m3u'@'localhost' IDENTIFIED BY 'iptv_m3u';
GRANT ALL PRIVILEGES ON * . * TO 'iptv_m3u'@'localhost';
CREATE USER 'iptv_m3u'@'%' IDENTIFIED BY 'iptv_m3u';
GRANT ALL PRIVILEGES ON * . * TO 'iptv_m3u'@'%';

# development user
CREATE USER 'developer'@'localhost' IDENTIFIED BY 'developer';
GRANT ALL PRIVILEGES ON * . * TO 'developer'@'localhost' WITH GRANT OPTION;
CREATE USER 'developer'@'%' IDENTIFIED BY 'developer';
GRANT ALL PRIVILEGES ON * . * TO 'developer'@'%' WITH GRANT OPTION;

CREATE DATABASE IPTV_M3U;
CREATE DATABASE IPTV_M3U_DEVEL;
CREATE DATABASE IPTV_M3U_STAGED;

