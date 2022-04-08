import time
import logging
import sys
import datetime
import tasks.api as API
from requests.auth import HTTPBasicAuth, HTTPDigestAuth
from sqlalchemy.orm.exc import NoResultFound
from tasks.downloader.tables import *
from tasks.m3u import M3UDeserializer, M3URecord, M3uItemType
from tasks.common.task import startup


def main():
    startup( '/home/mbertens/src/python/iptv_m3u_server' )
    if API.Db.Query( IptvConfig ).count() == 0:
        API.Db.Add( IptvConfig( CFG_ID       = 1,       # data1
                                CFG_NAME     = 'Local file',
                                CFG_ENABLED  = False,
                                CFG_AUTH     = 0,
                                CFG_LOCATION = 'file:///home/mbertens/src/python/iptv_m3u_server/data/tv_channels_152076191254123_plus.m3u' ) )

        API.Db.Add( IptvConfig( CFG_ID       = 2,       # data2
                                CFG_NAME     = 'Local file',
                                CFG_ENABLED  = False,
                                CFG_AUTH     = 0,
                                CFG_LOCATION = 'file:///home/mbertens/src/python/iptv_m3u_server/data/tv_channels_axnbpztec.m3u' ) )

        API.Db.Add( IptvConfig( CFG_ID       = 3,       # data3
                                CFG_NAME     = 'Local file',
                                CFG_ENABLED  = True,
                                CFG_AUTH     = 0,
                                CFG_LOCATION = 'file:///home/mbertens/src/python/iptv_m3u_server/data/tv_channels_7FjqvanBU_plus.m3u' ) )

        API.Db.Add( IptvConfig( CFG_ID       = 9,
                                CFG_NAME     = 'https://worldbilling.org',
                                CFG_ENABLED  = False,
                                CFG_AUTH     = 0,
                                CFG_LOCATION = 'http://xyz.watchbiptv.co:80/get.php?username=7FjqvanBU&password=Is9mjI50v0&output=ts&type=m3u_plus' ) )

    else:
        # API.Db.Query( IptvConfig ).filter( IptvConfig.CFG_ID == 1 ).CFG_ENABLED = True
        # API.Db.Query( IptvConfig ).filter( IptvConfig.CFG_ID == 2 ).CFG_ENABLED = False
        # API.Db.Commit()
        pass

    startTime = int(time.time())
    kwargs = {}
    config = API.Db.Query( IptvConfig ).filter( IptvConfig.CFG_ENABLED ).one()
    config: IptvConfig
    location = config.CFG_LOCATION
    if config.CFG_AUTH == 1:     # useranem/password in URI
        schema, url = location.split( '://' )
        location = f'{schema}://{config.CFG_USERNAME}:{config.CFG_PASSWORD}@{url}'

    elif config.CFG_AUTH == 2:     # BasicAuth
        kwargs = {
            'auth': HTTPBasicAuth( config.CFG_USERNAME, config.CFG_PASSWORD )
        }

    elif config.CFG_AUTH == 3:     # DigestAuth
        kwargs = {
            'auth': HTTPDigestAuth( config.CFG_USERNAME, config.CFG_PASSWORD )
        }

    reader = M3UDeserializer( location, **kwargs )
    timeStamp = datetime.datetime.utcnow()
    for record in reader:
        record: M3URecord
        logging.info( record )
        if record.Type == M3uItemType.MOVIE:
            try:
                movie: IptvMovie    = API.Db.Query( IptvMovie ).filter( IptvMovie.IM_NAME == record.Name ).one()
                movie.IM_UPDATE     = timeStamp

            except NoResultFound:
                movie = IptvMovie()
                movie.IM_UPDATE     = timeStamp
                record.put( movie )
                API.Db.Add( movie )

            if movie.IM_INDEX is None:
                movie.IM_INDEX      = 9999

            API.Db.Commit()

        elif record.Type == M3uItemType.SERIE_EPISODE:
            try:
                serie: IptvSerie    = API.Db.Query( IptvSerie ).filter( IptvSerie.IS_NAME == record.Group ).one()
                serie.IS_UPDATE     = timeStamp

            except NoResultFound:
                serie = IptvSerie()
                serie.IS_UPDATE = timeStamp
                record.put( serie )
                API.Db.Add( serie )
                API.Db.Commit()

            if serie.IS_INDEX is None:
                serie.IS_INDEX      = 9999

            try:
                episode: IptvEpisode = API.Db.Query( IptvEpisode ).filter( and_( IptvEpisode.IE_NAME == record.Name,
                                                                                 IptvEpisode.IE_GROUP == record.Group ) ).one()
                episode.IE_UPDATE   = timeStamp

            except NoResultFound:
                episode = IptvEpisode()
                record.put( episode )
                episode.IE_UPDATE   = timeStamp
                episode.IE_IS_ID    = serie.IS_ID
                API.Db.Add( episode )

            API.Db.Commit()

        else:   # M3uItemType.IPTV_CHANNEL
            try:
                bouget = API.Db.Query( IptvBouget ).filter( IptvBouget.IB_NAME == record.Group ).one()
                bouget.IB_UPDATE    = timeStamp

            except NoResultFound:
                bouget = IptvBouget()
                bouget.IB_UPDATE    = timeStamp
                record.put( bouget )
                API.Db.Add( bouget )
                API.Db.Commit()

            try:
                channel: IptvChannel = API.Db.Query( IptvChannel ).filter( and_( IptvChannel.IC_NAME == record.Name,
                                                                                 IptvChannel.IC_GROUP == record.Group ) ).one()
                channel.IC_UPDATE   = timeStamp
                channel.IC_NAME     = record.Name

            except NoResultFound:
                channel = IptvChannel()
                record.put( channel )
                channel.IC_IB_ID    = bouget.IB_ID
                channel.IC_UPDATE   = timeStamp

                API.Db.Add( channel )

            if channel.IC_INDEX is None:
                channel.IC_INDEX    = 9999

            API.Db.Commit()

    endTime = time.strftime('%H:%M:%S', time.gmtime(int( time.time() - startTime )))
    logging.info( f'{endTime} elapsed' )
    return


if __name__ == '__main__':
    main()

    """
    .headers on
    .mode column
    .width -5 -7 50 30
     
    """
    # print( 'Correct iptv_bouget')
    # API.Db.Session.execute(  )
    """ 
update iptv_bouget set bg_enabled = 1 where bg_name in ( 'Netherlands - LBR', 'Netherlands - HBR', 'Netherlands Sports', 'Belgium', 'United Kingdom', 
'United Kingdom Sport', 'Formule 1', 'For Adults' );
    """
    #
    # print( 'Correct iptv_series')
    # API.Db.Session.execute(
    """
update iptv_series set se_enabled = 1 where se_name in ( 'Witse', 'Baantjer', 'Danni Lowinski', 'Flikken', 'Moordvrouw', 'Knight Rider', 'The Good Doctor',
'Airwolf', 'Without a Trace', 'Dexter', 'Dexter: New Blood', 'NCIS', 'Castle', 'Unforgettable', 'Person of Interest', 'CSI: NY', 'Formula 1: Drive to Survive',
'SEAL Team', "Hitler's Circle of Evil", 'Strike Back', 'ReBoot: The Guardian Code', 'Rizzoli & Isles', 'Body of Proof',
'Suits', 'Hunting Hitler', 'Das Boot', 'GRAND PRIX Driver', 'CSI: Crime Scene Investigation', 'V: The Final Battle',
'V', 'NOS4A2', 'The Last Ship', 'Baantjer het Begin (2020)', 'The Vietnam War', 'Thunderbirds', 'Unforgotten', 'CSI: Miami',
'Battlestar Galactica', 'The 4400', 'The Mentalist', 'BattleBots', 'Apollo: Back to the Moon' );
    """
    # )

    # print( 'Correct iptv_movie')
    # API.Db.Session.execute(
    """
update iptv_movie set im_enabled = 1 where im_name in ( 'Thunderbirds - 1952', 'National Geographic: 42 Ways to Kill Hitler - 2008',
'Astronaut - 2019', 'Attack on Titan II: End of the World - 2015', 'Battlestar Galactica: The Plan - 2009',
'Blade Runner 2049 - 2017', 'Bohemian Rhapsody - 2018', 'Deepwater Horizon - 2016', 'Driven - 2018', 'Drive - 2019',
'Final Destination - 2000', 'Final Destination 2 - 2003', 'Final Destination 3 - 2006', 'The Final Destination - 2009',
'Final Destination 5 - 2011', 'Get Carter - 2000', "Hachi: A Dog's Tale - 2009", 'Hacker - 2019', 'Hard Target 2 - 2016',
'Hard to Kill - 1990', "Hitler's Steel Beast - 2017", 'Ice Age: Collision Course - 2016', 'Ice Age: The Great Egg-Scapade - 2016',
'Jack Ryan: Shadow Recruit - 2014', 'John Wick: Chapter 2 - 2017', 'Johnny Mnemonic - 1995', 'Kill Bill: Vol. 1 - 2003',
'Kill Bill: Vol. 2 - 2004', 'Kingsglaive: Final Fantasy XV - 2016', 'Kursk - 2018', 'K-19: The Widowmaker - 2002',
"Ocean's Eight - 2018", "Ocean's Eleven - 2001", "Ocean's Thirteen - 2007", "Ocean's Twelve - 2004", 'Shaft (1971)', 'Shaft - 2019',
'Terminator: Dark Fate - 2019', 'Shaft - 2019', 'Shrek 2 - 2004', 'Shrek - 2001', 'Shrek Forever After - 2010', 'Shrek the Third - 2007',
'S.W.A.T.: Under Siege - 2017', 'The Matrix - 1999', 'The Matrix Reloaded - 2003', 'The Matrix Revolutions - 2003', 'Mechanic: Resurrection - 2016',
'The Mechanic - 2011', 'Apollo 11 - 2019', 'Ice Age - 2002', 'Ice Age: The Meltdown - 2006', 'Ice Age: Dawn of the Dinosaurs - 2009',
'Ice Age: Continental Drift - 2012', 'Déjà Vu - 2006', 'MacGyver: Lost Treasure of Atlantis - 1994', 'MacGyver: Trail to Doomsday - 1994',
'Terminator: Dark Fate - 2019', 'Erased - 2012', 'Poseidon - 2006', 'Angels & Demons - 2009', 'The Da Vinci Code - 2006',
'Men in Black - 1997', 'Men in Black II - 2002', 'Men in Black 3 - 2012', 'Men in Black: International - 2019',
'Mission: Impossible - 1996', 'Mission: Impossible - Fallout - 2018', 'Mission: Impossible - Rogue Nation - 2015',
'Mission: Impossible II - 2000', 'Mission: Impossible III - 2006', 'Short Circuit - 1986', 'Short Circuit 2 - 1988',
'The Heineken Kidnapping - 2011', 'Taken - 2008', 'Taken 2 - 2012', 'Taken 3 - 2014', 'The Transporter Refueled - 2015',
'The Transporter - 2002', 'Transporter 3 - 2008', 'Transporter 2 - 2005', 'Mayday - 2019', 'The Perfect Storm - 2000',
'Star Wars: The Rise of Skywalker - 2019', 'Rusland en de MH17', 'RED - 2010', 'RED 2 - 2013', 'John Wick (2014)',
'Harry Potter and the Deathly Hallows: Part 2 (2011)', 'Harry Potter and the Order of the Phoenix (2007)',
'Harry Potter and the Prisoner of Azkaban (2004)', 'Harry Potter and the Chamber of Secrets (2002)',
'Harry Potter and the Goblet of Fire (2005)', "Harry Potter and the Philosopher's Stone (2001)",
'Harry Potter and the Deathly Hallows: Part 1 (2010)', 'Harry Potter and the Half-Blood Prince (2009)',
'Extraction (2020)', 'Defiance (2008)', 'Risen (2016)', 'Dreamscape (1984)', 'Fallen (1998)',
'T-34 (2018)', 'Iron Man 3 (2013)', 'Iron Man 2 (2010)', 'Battle Earth (2013)', 'The Pianist (2002)',
'Jack Reacher (2012)', 'Jack Reacher: Never Go Back (2016)', 'rain the Titanic (2016)', 'Pitch Black (2000)',
'Crimson Tide (1995)', 'Shaft (2000)', 'Fast & Furious Presents: Hobbs & Shaw (2019)', 'The Fast and the Furious (2001)',
'The Fast and the Furious: Tokyo Drift (2006)', 'Fast & Furious (2009)', 'Fast Five (2011)', 'Fast & Furious 6 (2013)',
'Furious 7 (2015)', 'The Fate of the Furious (2017)', 'Captain Phillips (2013)', 'Maleficent (2014)',
'WALL·E (2008)', 'The Revenant (2015)', 'Rush (2013)', 'Sabotage (2014)', 'Terminal (2018)', 'Thunderbird 6 (1968)',
'Thunderbirds are GO (1966)', 'Insurgent (2015)', 'Allegiant (2016)', 'Thunderbirds (2004)', "Tom Clancy's Without Remorse (2021)",
'Chernobyl 1986 (2021)', 'Resurgence (2021)', 'The Green Mile (1999)', 'Spooks: The Greater Good (2015)',
'Reminiscence  (2021)', 'The Pacifier (2005)', 'Being James Bond (2021)', 'Schumacher (2021)', 'Dune (2021)',
'Cannonball Run II (1984)',  'The Cannonball Run (1981', 'X-Men (2000)', 'X-Men: Days of Future Past (2014)',
'X-Men: First Class (2011)', 'X-Men Origins: Wolverine (2009)', 'X-Men: The Last Stand (2006)',
'Smokey and the Bandit (1977)', 'Smokey and the Bandit II (1980)', 'Smokey and the Bandit Part 3 (1983)' );
    """
    # )
    # API.Db.Commit()

"""
select * from iptv_channel where ch_alias is not null or ch_index not is null;

select bg_id, bg_enabled, bg_name, bg_update from iptv_bouget where bg_enabled = 1;
select count(*) from iptv_bouget where bg_enabled = 1;

select se_id, se_enabled, se_name, se_update from iptv_series where se_enabled = 1;
select count(*) from iptv_series where se_enabled = 1;

select im_id, im_enabled, im_name, im_update from iptv_movie where im_enabled = 1;
select count(*) from iptv_movie where im_enabled = 1;

UPDATE iptv_channel SET ch_alias = 'NPO1 HD', ch_index = 1 WHERE ch_name = 'NPO 1';
UPDATE iptv_channel SET ch_alias = 'NPO2 HD', ch_index = 2 WHERE ch_name = 'NPO 2';
UPDATE iptv_channel SET ch_alias = 'NPO3 HD', ch_index = 3 WHERE ch_name = 'NPO 3';
UPDATE iptv_channel SET ch_alias = 'RTL4 HD', ch_index = 4 WHERE ch_name = 'RTL 4';
UPDATE iptv_channel SET ch_alias = 'RTL5 HD', ch_index = 5 WHERE ch_name = 'RTL 5';
UPDATE iptv_channel SET ch_alias = 'SBS6 HD', ch_index = 6 WHERE ch_name = 'SBS 6';
UPDATE iptv_channel SET ch_alias = 'RTL7 HD', ch_index = 7 WHERE ch_name = 'RTL 7';
UPDATE iptv_channel SET ch_alias = 'RTL8 HD', ch_index = 8 WHERE ch_name = 'RTL 8';
UPDATE iptv_channel SET ch_alias = 'Veronica/DisneyXD HD', ch_index = 9 WHERE ch_name = 'VERONICA /DISNEY XD';
UPDATE iptv_channel SET ch_alias = 'SBS9', ch_index = 9 WHERE ch_name = 'SBS 9';
UPDATE iptv_channel SET ch_alias = 'NET5 HD', ch_index = 10 WHERE ch_name = 'NET 5';
UPDATE iptv_channel SET ch_alias = 'FOX Channel', ch_index = 27 WHERE ch_name = 'FOX';
UPDATE iptv_channel SET ch_alias = 'RTL Z', ch_index = 19 WHERE ch_name = 'RTL Z';
UPDATE iptv_channel SET ch_alias = 'RTL Crime', ch_index = 13 WHERE ch_name = 'RTL CRIME';
UPDATE iptv_channel SET ch_alias = 'BBC First', ch_index = 23 WHERE ch_name = 'BBC FIRST';
UPDATE iptv_channel SET ch_alias = 'Film1 Premiere HD', ch_index = 61 WHERE ch_name = 'FILM 1 PREMIERE';
UPDATE iptv_channel SET ch_alias = 'Film1 Family', ch_index = 59 WHERE ch_name = 'FILM 1 FAMILY';
UPDATE iptv_channel SET ch_alias = 'Film1 Drama', ch_index = 57 WHERE ch_name = 'FILM 1 DRAMA';
UPDATE iptv_channel SET ch_alias = 'Film1 Action', ch_index = 55 WHERE ch_name = 'FILM 1 ACTION';
UPDATE iptv_channel SET ch_alias = 'Filmbox NL HD', ch_index = 68 WHERE ch_name = 'FILMBOX NL';
UPDATE iptv_channel SET ch_alias = 'NGC HD',  ch_index = 14 WHERE ch_name = 'NAT GEOGRAPHIC';
UPDATE iptv_channel SET ch_alias = 'National Geographic Wild HD', ch_index = 20 WHERE ch_name = 'NGC WILD';
UPDATE iptv_channel SET ch_alias = 'Spike', ch_index = 70 WHERE ch_name = 'SPIKE';
UPDATE iptv_channel SET ch_alias = 'Disney Channel', ch_index = 16 WHERE ch_name = 'DISNEY CHANNEL';
UPDATE iptv_channel SET ch_alias = 'Comedy Central', ch_index = 15 WHERE ch_name = 'COMEDY CENTRAL';
UPDATE iptv_channel SET ch_alias = 'ONS', ch_index = 21 WHERE ch_name = 'ONS';
UPDATE iptv_channel SET ch_alias = 'NPO Politiek en Nieuws', ch_index = 18 WHERE ch_name = 'NPO POLITIEK';
UPDATE iptv_channel SET ch_alias = 'NPO Politiek en Nieuws', ch_index = 18 WHERE ch_name = 'NPO NIEUWS';
UPDATE iptv_channel SET ch_alias = 'Nautical HD', ch_index = 69 WHERE ch_name = 'NAUTICAL';
UPDATE iptv_channel SET ch_alias = 'NPO1 HD', ch_index = 1 WHERE ch_name = 'NPO 1';
UPDATE iptv_channel SET ch_alias = 'NPO2 HD', ch_index = 2 WHERE ch_name = 'NPO 2';
UPDATE iptv_channel SET ch_alias = 'NPO3 HD', ch_index = 3 WHERE ch_name = 'NPO 3';
UPDATE iptv_channel SET ch_alias = 'RTL4 HD', ch_index = 4 WHERE ch_name = 'RTL 4';
UPDATE iptv_channel SET ch_alias = 'RTL5 HD', ch_index = 5 WHERE ch_name = 'RTL 5';
UPDATE iptv_channel SET ch_alias = 'SBS6 HD', ch_index = 6 WHERE ch_name = 'SBS 6';
UPDATE iptv_channel SET ch_alias = 'RTL7 HD', ch_index = 7 WHERE ch_name = 'RTL 7';
UPDATE iptv_channel SET ch_alias = 'RTL8 HD', ch_index = 8 WHERE ch_name = 'RTL 8';
UPDATE iptv_channel SET ch_alias = 'SBS9', ch_index = 9 WHERE ch_name = 'SBS 9';
UPDATE iptv_channel SET ch_alias = 'NET5 HD', ch_index = 10 WHERE ch_name = 'NET 5';
UPDATE iptv_channel SET ch_alias = 'Veronica/DisneyXD HD', ch_index = 11 WHERE ch_name = 'VERONICA/DISNEY/XD';
UPDATE iptv_channel SET ch_alias = 'FOX Channel', ch_index = 27 WHERE ch_name = 'FOX';
UPDATE iptv_channel SET ch_alias = 'Spike', ch_index = 70 WHERE ch_name = 'SPIKE';
UPDATE iptv_channel SET ch_alias = 'RTL Z', ch_index = 19 WHERE ch_name = 'RTL Z';
UPDATE iptv_channel SET ch_alias = 'BBC First', ch_index = 23 WHERE ch_name = 'BBC FIRST';
UPDATE iptv_channel SET ch_alias = 'History HD BNL', ch_index = 74 WHERE ch_name = 'HISTORY';
UPDATE iptv_channel SET ch_alias = 'National Geographic Wild HD', ch_index = 20 WHERE ch_name = 'NAT GEO WILD';
UPDATE iptv_channel SET ch_alias = 'NGC HD', ch_index = 14 WHERE ch_name = 'NAT GEO CHANNEL';
UPDATE iptv_channel SET ch_alias = 'Film1 Action', ch_index = 55 WHERE ch_name = 'FILM1 ACTION';
UPDATE iptv_channel SET ch_alias = 'Film1 Drama', ch_index = 57 WHERE ch_name = 'FILM 1 DRAMA';
UPDATE iptv_channel SET ch_alias = 'Film1 Family', ch_index = 59 WHERE ch_name = 'FILM 1 FAMILY';
UPDATE iptv_channel SET ch_alias = 'Film1 Premiere HD', ch_index = 61 WHERE ch_name = 'FILM 1 PREMIERE';
UPDATE iptv_channel SET ch_alias = 'Disney Channel', ch_index = 16 WHERE ch_name = 'DISNEY CHANNEL';
UPDATE iptv_channel SET ch_alias = 'Comedy Central', ch_index = 15 WHERE ch_name = 'COMEDY CENTRAL';
UPDATE iptv_channel SET ch_index = 9999 WHERE ch_index is null;

INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NPO 1', 'NPO1 HD', '1');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NPO 2', 'NPO2 HD', '2');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NPO 3', 'NPO3 HD', '3');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('RTL 4', 'RTL4 HD', '4');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('RTL 5', 'RTL5 HD', '5');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('SBS 6', 'SBS6 HD', '6');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('RTL 7', 'RTL7 HD', '7');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('RTL 8', 'RTL8 HD', '8');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('VERONICA /DISNEY XD', 'Veronica/DisneyXD HD', '11');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('SBS 9', 'SBS9', '9');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NET 5', 'NET5 HD', '10');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('FOX', 'FOX Channel', '27');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('RTL Z', 'RTL Z', '19');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('TLC', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('RTL CRIME', 'RTL Crime', '13');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('RTL LOUNGE', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('BBC ONE', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('BBC TWO', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('BBC FIRST', 'BBC First', '23');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('BBC ENTERTAINMENT', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('TV5MONDE EU', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('E! ENTERTAINMENT', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('CBS REALITY', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('FILM 1 PREMIERE', 'Film1 Premiere HD', '61');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('FILM 1 FAMILY', 'Film1 Family', '59');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('FILM 1 DRAMA', 'Film1 Drama', '57');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('FILM 1 ACTION', 'Film1 Action', '55');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('FILMBOX NL', 'Filmbox NL HD', '68');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('DISCOVERY', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('DISCOVERY SCIENCE', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('DISCOVERY ID', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('CRIME & INVESTIGATION', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NAT GEOGRAPHIC', 'NGC HD', '14');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NGC WILD', 'National Geographic Wild HD', '20');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('LOVE NATURE', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('ANIMAL PLANET', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('SPIKE', 'Spike', '70');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('HISTORY', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('HORSE & COUNTRY', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('DISNEY CHANNEL', 'Disney Channel', '16');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('COMEDY CENTRAL', 'Comedy Central', '15');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('COMEDY CENTRAL EXTRA', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('BOOMERANG', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('CARTOON NETWORK', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('BABY TV', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NICK JUNIOR', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NICK MUSIC', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NICK TOONS', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NICKELODEON', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('RTL TELEKIDS', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('PEBBLE TV', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('ONS', 'ONS', '21');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NPO 1 EXTRA', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NPO 2 EXTRA', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NPO POLITIEK', 'NPO Politiek en Nieuws', '18');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NPO NIEUWS', 'NPO Politiek en Nieuws', '18');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('SHORTS TV', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('OUT TV', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('TV GELDERLAND', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('TV NOORD', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('TV OOST', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('RTV DRENTHE', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('L1MBURG', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('OMROEP BRABANT TELEVISIE', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('OMROEP FRIESLAND', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('RTV-7', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('XITE', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('DANCE TELEVISION', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('TV ORANJE', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('TV 538', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('MTV', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('MEZZO', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('MTV 90s', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('MTV 80s', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('THE BOX', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NAUTICAL', 'Nautical HD', '69');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('STINGRAY LITE TV', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('DUCK TV', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('TRAVEL XP NL', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('AUTOMOTORSPORT', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('EXTREME SPORT CHANNEL', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('TV WEST', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NH NIEUWS', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('TV RIJNMOND', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('OMROEP ZEELAND', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NPO ZAPPELIN XTRA / NPO BEST', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NPO 1', 'NPO1 HD', '1');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NPO 2', 'NPO2 HD', '2');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NPO 3', 'NPO3 HD', '3');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('RTL 4', 'RTL4 HD', '4');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('RTL 5', 'RTL5 HD', '5');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('SBS 6', 'SBS6 HD', '6');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('RTL 7', 'RTL7 HD', '7');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('RTL 8', 'RTL8 HD', '8');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('SBS 9', 'SBS9', '9');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NET 5', 'NET5 HD', '10');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('VERONICA/DISNEY/XD', 'Veronica/DisneyXD HD', '11');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('FOX', 'FOX Channel', '27');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('SPIKE', 'Spike', '70');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('TLC', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('RTL Z', 'RTL Z', '19');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('BBC FIRST', 'BBC First', '23');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('BBC TWO', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('CANVAS', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('CARTOON NETWORK', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('DISCOVERY', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('DISCOVERY SCIENCE', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('DISCOVERY ID', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('HISTORY', 'History HD BNL', '74');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NAT GEO WILD', 'National Geographic Wild HD', '20');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NAT GEO CHANNEL', 'NGC HD', '14');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('ANIMAL PLANET', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('FILM1 ACTION', 'Film1 Action', '55');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('FILM 1 DRAMA', 'Film1 Drama', '57');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('FILM 1 FAMILY', 'Film1 Family', '59');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('FILM 1 PREMIERE', 'Film1 Premiere HD', '61');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NPO 1 EXTRA', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NPO 2 EXTRA', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('NICKELODEON', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('DISNEY CHANNEL', 'Disney Channel', '16');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('COMEDY CENTRAL', 'Comedy Central', '15');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('MTV', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('MTV LIVE', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('DANCE TELEVISION', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('XITE', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('E!', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('LOVE NATURE', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('FASHION TV', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('HORSE & COUNTRY TV', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('OUTTV', '', '999');
INSERT INTO iptv_alias ("ia_name", "ia_alias", "ia_index") VALUES ('ZIGGO TV', '', '999');

"""