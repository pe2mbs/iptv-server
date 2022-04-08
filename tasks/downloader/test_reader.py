def test():
    logging.basicConfig( level = logging.INFO, stream = sys.stdout )
    API.logger = logging.getLogger()
    sqlite_filepath = '/home/mbertens/src/python/iptv_m3u_server/data/test2.db'
    API.Db = Database( sqlite_filepath )
    filename = '/home/mbertens/src/python/iptv_m3u_server/data/tv_channels_7FjqvanBU_plus.m3u'
    reader = M3UReader( 'file://{}'.format( filename ) )

    attributes = ( 'channel', 'group-title', 'duration', 'link', 'tvg-id', 'tvg-logo', 'tvg-name' )
    fields = ( 'im_name', 'im_group', 'im_duration', 'im_link', 'im_tvg_id', 'im_tvg_logo', 'im_tvg_name' )
    timeStamp = datetime.datetime.utcnow()
    for _type, title, record in reader:
        if _type == M3uItemType.MOVIE:
            try:
                movie: IptvMovie = API.Db.Query( IptvMovie ).filter( IptvMovie.im_name == title ).one()
                movie.im_update = timeStamp

            except NoResultFound:
                movie = IptvMovie()
                for key, field in zip( attributes, fields ):
                    if key in record:
                        setattr( movie, field, record[ key ] )

                    movie.im_update = timeStamp

                API.Db.Add( movie )

            API.Db.Commit()

        elif _type == M3uItemType.SERIE_EPISODE:
            try:
                serie: IptvSeries = API.Db.Query( IptvSeries ).filter( IptvSeries.se_name == title ).one()
                serie.se_update = timeStamp

            except NoResultFound:
                serie = IptvSeries( se_name = title, se_update = timeStamp )
                API.Db.Add( serie )
                API.Db.Commit()

            try:
                episode: IptvSerie = API.Db.Query( IptvSerie ).filter( and_( IptvSerie.is_name == record[ 'channel' ],
                                                                             IptvSerie.is_group == record[ 'group-title' ] ) ).one()
                episode.is_update = timeStamp

            except NoResultFound:
                episode = IptvSerie()
                for key, field in zip( attributes, fields ):
                    if key in record:
                        setattr( episode, field, record[ key ] )

                episode.is_update = timeStamp
                episode.is_se_id = serie.se_id
                API.Db.Add( episode )

            API.Db.Commit()

        else:   # M3uItemType.IPTV_CHANNEL
            try:
                bouget = API.Db.Query( IptvBouget ).filter( IptvBouget.bg_name == record[ 'group-title' ] ).one()
                bouget.bg_update = timeStamp

            except NoResultFound:
                bouget = IptvBouget( bg_name = record[ 'group-title' ], bg_update = timeStamp )
                API.Db.Add( bouget )
                API.Db.Commit()

            try:
                channel: IptvChannel = API.Db.Query( IptvChannel ).filter( and_( IptvChannel.ch_name == record[ 'channel' ],
                                                                                 IptvChannel.ch_group == record[ 'group-title' ] ) ).one()
                channel.ch_update = timeStamp

            except NoResultFound:
                channel = IptvChannel()
                for key, field in zip( attributes, fields ):
                    if key in record:
                        setattr( channel, field, record[ key ] )

                channel.ch_bg_id    = bouget.bg_id
                channel.ch_update   = timeStamp
                API.Db.Add( channel )

            API.Db.Commit()

    return


if __name__ == '__main__':
    test()
    """
    .headers on
    .mode column
    .width -5 -7 50 30
     
    """
    API.Db.Session.execute( "update iptv_bouget set bg_enabled = 1 where bg_name in ( 'Netherlands - LBR', 'Netherlands - LBR', 'Netherlands - LBR', 'Belgium', 'United Kingdom', 'United Kingdom Sport', 'Formule 1', 'For Adults' )" )

    API.Db.Session.execute( """update iptv_series set se_enabled = 1 where se_name in ( 'Witse', 'Baantjer', 'Danni Lowinski', 'Flikken', 'Moordvrouw', 'Knight Rider', 'The Good Doctor',
                            'Airwolf', 'Without a Trace', 'Dexter', 'Dexter: New Blood', 'NCIS', 'Castle', 'Unforgettable', 'Person of Interest', 'CSI: NY', 'Formula 1: Drive to Survive',
                              'SEAL Team', "Hitler's Circle of Evil", 'Strike Back', 'ReBoot: The Guardian Code', 'Rizzoli & Isles', 'Body of Proof',
                               'Suits', 'Hunting Hitler', 'Das Boot', 'GRAND PRIX Driver', 'CSI: Crime Scene Investigation', 'V: The Final Battle',
                                'V', 'NOS4A2', 'The Last Ship', 'Baantjer het Begin (2020)', 'The Vietnam War', 'Thunderbirds', 'Unforgotten', 'CSI: Miami',
                                 'Battlestar Galactica', 'The 4400', 'The Mentalist', 'BattleBots', 'Apollo: Back to the Moon' )""" )

    API.Db.Session.execute( """update iptv_movie set im_enabled = 1 where im_name in ( 'Thunderbirds - 1952', 'National Geographic: 42 Ways to Kill Hitler - 2008',
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
                              'Smokey and the Bandit (1977)', 'Smokey and the Bandit II (1980)', 'Smokey and the Bandit Part 3 (1983)' )""" )


"""
select bg_id, bg_enabled, bg_name, bg_update from iptv_bouget where bg_enabled = 1;
select count(*) from iptv_bouget where bg_enabled = 1;

select se_id, se_enabled, se_name, se_update from iptv_series where se_enabled = 1;
select count(*) from iptv_series where se_enabled = 1;

select im_id, im_enabled, im_name, im_update from iptv_movie where im_enabled = 1;
select count(*) from iptv_movie where im_enabled = 1;
"""