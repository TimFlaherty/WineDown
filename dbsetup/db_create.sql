-- db_create.sql

DROP DATABASE IF EXISTS winedown;

CREATE DATABASE winedown;

USE winedown;

CREATE TABLE winery (
wineryid INT(6) ZEROFILL NOT NULL AUTO_INCREMENT PRIMARY KEY,
wineryname VARCHAR(40) NOT NULL,
lat DECIMAL(10, 8),
lng DECIMAL(11, 8),
address VARCHAR(256) NOT NULL,
hours VARCHAR(256),
url VARCHAR(2083),
phone VARCHAR(15)
);

CREATE TABLE wine (
wineid INT(7) ZEROFILL NOT NULL AUTO_INCREMENT PRIMARY KEY,
wineryid INT(6) ZEROFILL NOT NULL,
winename VARCHAR(50),
vintage INT(4),
varietal VARCHAR(30) NOT NULL,
FOREIGN KEY (wineryid) REFERENCES winery(wineryid)
);

CREATE TABLE usr (
uid INT(8) ZEROFILL NOT NULL AUTO_INCREMENT PRIMARY KEY,
uname VARCHAR(30) NOT NULL,
pwd CHAR(60),
email VARCHAR(256),
UNIQUE (uname)
);

CREATE TABLE review (
reviewid INT(9) ZEROFILL NOT NULL AUTO_INCREMENT PRIMARY KEY,
wineid INT(7) ZEROFILL,
wineryid INT(6) ZEROFILL NOT NULL,
uid INT(8) ZEROFILL NOT NULL,
rating INT(1) NOT NULL,
narrative VARCHAR(256),
rvwdate DATE,
rvwtime TIME,
FOREIGN KEY (wineid) REFERENCES wine(wineid),
FOREIGN KEY (wineryid) REFERENCES winery(wineryid),
FOREIGN KEY (uid) REFERENCES usr(uid)
);

CREATE VIEW winerating AS
	SELECT wineid,
	wineryid,	
	AVG(rating) AS winerating
	FROM review a
	WHERE wineid > 0
	GROUP BY wineid, wineryid;
	
CREATE VIEW wineryrating AS
	SELECT wineryid, 
	AVG(rating) AS wineryrating 
	FROM review 
	WHERE wineid IS NULL 
	GROUP BY wineryid;

CREATE VIEW wineryvars AS
	SELECT wineryid, 
	GROUP_CONCAT(DISTINCT varietal SEPARATOR ", ") AS varietals 
	FROM wine 
	GROUP BY wineryid;
	
CREATE VIEW winerypins AS
	SELECT a.wineryid, 
	a.wineryname, 
	a.lat, 
	a.lng, 
	a.hours, 
	a.address,
	b.varietal,
	d.varietals,
	c.wineryrating
	FROM winery a 
	LEFT JOIN wine b 
	ON a.wineryid = b.wineryid 
	LEFT JOIN wineryrating c
	ON a.wineryid = c.wineryid
	LEFT JOIN wineryvars d
	ON a.wineryid = d.wineryid;

CREATE VIEW wines AS
	SELECT a.wineryid,
	a.wineid,
	a.winename,
	a.vintage,
	a.varietal,
	b.winerating
	FROM wine a
	LEFT JOIN winerating b
	ON a.wineid = b.wineid;
	
CREATE VIEW wineryrvw AS
	SELECT b.wineryid,
	b.rating,
	b.narrative,
	DATE_FORMAT(b.rvwdate, "%M %d, %Y") AS rvwdate,
	a.uname,
	a.uid
	FROM usr a
	JOIN review b
	ON a.uid = b.uid
	AND b.wineid IS NULL;
	
CREATE VIEW winervw AS
	SELECT b.wineid,
	b.rating,
	b.narrative,
	DATE_FORMAT(b.rvwdate, "%M %d, %Y") AS rvwdate,
	a.uname,
	a.uid
	FROM usr a
	JOIN review b
	ON a.uid = b.uid
	AND b.wineid > 0;
	
CREATE VIEW profile AS
	SELECT a.uid,
	a.uname,
	b.wineryid,
	b.wineid,
	b.rating,
	DATE_FORMAT(b.rvwdate, "%M %d, %Y") AS rvwdate,
	b.narrative,
	c.winename,
	d.wineryname
	FROM usr a
	JOIN review b
	ON a.uid = b.uid
	LEFT JOIN wine c
	ON b.wineid = c.wineid
	JOIN winery d
	ON b.wineryid = d.wineryid;