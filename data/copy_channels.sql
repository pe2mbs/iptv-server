select m3_id, m3_title, m3_link from M3U where m3_title LIKE "%%[NL] [HD]%%";

-- 1|NEDERLAND
-- 2|ENGELAND
-- 3|F1 SPORT
-- 4|MOVIES
-- 5|NETFLIX
-- 6|SERIES
-- 7|SPORT
-- 8|DOCUMENTAIRE

insert into CHANNEL ( c_m3_id, c_name, c_b_id, c_enabled )
  select m3_id, m3_title, 1, 1 from M3U where m3_title LIKE "[NL] [HD]%%";
UPDATE CHANNEL set c_b_id = 5 where c_name LIKE "%% FLIX %%";
UPDATE CHANNEL set c_b_id = 7 where c_name LIKE "%%ESPN%%";
UPDATE CHANNEL set c_name = substr( c_name, 11 ) where c_name like "[NL] [HD] %%";

insert into CHANNEL ( c_m3_id, c_name, c_b_id, c_enabled )
  select m3_id, m3_title, 3, 1 from M3U where m3_title LIKE "[UK] %%F1%%";
insert into CHANNEL ( c_m3_id, c_name, c_b_id, c_enabled )
  select m3_id, m3_title, 3, 1 from M3U where m3_title LIKE "[F1] F1%%";
insert into CHANNEL ( c_m3_id, c_name, c_b_id, c_enabled )
  select m3_id, m3_title, 3, 1 from M3U where m3_title LIKE "[F1] [UK] %%F1%%";

UPDATE CHANNEL set c_name = substr( c_name, 11 ) where c_name like "[F1] [UK]%%";
UPDATE CHANNEL set c_name = substr( c_name, 11 ) where c_name like "[UK]%%";
UPDATE CHANNEL set c_name = substr( c_name, 6 ) where c_name like "[F1] F1%%";

SELECT *  FROM channel;