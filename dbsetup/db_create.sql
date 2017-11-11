-- db_create.sql

DROP DATABASE IF EXISTS winedown;

CREATE DATABASE winedown;

USE winedown;

CREATE TABLE winery (
wineryid INT(6) ZEROFILL NOT NULL AUTO_INCREMENT PRIMARY KEY,
wineryname VARCHAR(40) NOT NULL,
lat DECIMAL(10, 8) NOT NULL,
lng DECIMAL(11, 8) NOT NULL,
address VARCHAR(256) NOT NULL,
hours VARCHAR(256),
url VARCHAR(2083),
phone VARCHAR(15)
);

CREATE TABLE wine (
wineid INT(7) ZEROFILL NOT NULL AUTO_INCREMENT PRIMARY KEY,
wineryid INT(6) ZEROFILL NOT NULL,
winename VARCHAR(50) NOT NULL,
vintage INT(4),
varietal VARCHAR(25),
FOREIGN KEY (wineryid) REFERENCES winery(wineryid)
);

CREATE TABLE usr (
uid INT(8) ZEROFILL NOT NULL AUTO_INCREMENT PRIMARY KEY,
uname VARCHAR(25) NOT NULL,
pwd VARCHAR(25),
email VARCHAR(256)
);

CREATE TABLE review (
reviewid INT(9) ZEROFILL NOT NULL AUTO_INCREMENT PRIMARY KEY,
wineid INT(7) ZEROFILL,
wineryid INT(6) ZEROFILL NOT NULL,
uid INT(8) ZEROFILL NOT NULL,
rating INT(1) NOT NULL,
narrative VARCHAR(256),
FOREIGN KEY (wineid) REFERENCES wine(wineid),
FOREIGN KEY (wineryid) REFERENCES winery(wineryid),
FOREIGN KEY (uid) REFERENCES usr(uid)
);

CREATE VIEW winerating AS
	SELECT a.wineid,
	a.wineryid,	
	b.varietal,
	AVG(a.rating) AS winerating
	FROM review a
	JOIN wine b 
	ON a.wineid = b.wineid
	WHERE a.wineid > 0 
	GROUP BY wineid;
	
CREATE VIEW wineryrating AS
	SELECT wineryid, 
	AVG(rating) AS wineryrating 
	FROM review 
	WHERE wineid IS NULL 
	GROUP BY wineryid;

CREATE VIEW winerypins AS
	SELECT a.wineryid, 
	a.wineryname, 
	a.lat, 
	a.lng, 
	a.hours, 
	GROUP_CONCAT(DISTINCT b.varietal SEPARATOR ", ") AS varietals,
	c.wineryrating
	FROM winery a 
	LEFT JOIN winerating b 
	ON a.wineryid = b.wineryid 
	LEFT JOIN wineryrating c
	ON a.wineryid = c.wineryid
	GROUP BY a.wineryid;
