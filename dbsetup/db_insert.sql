-- db_insert.sql

USE winedown;

INSERT INTO winery (wineryname, lat, lng, address, hours, url, phone) VALUES 
('Amador Cellars', 38.5252037, -120.8193744, '11093 Shenandoah Rd, Plymouth, CA 95669', '11:00AM-5:00PM Daily', 'https://www.amadorcellars.com', '(209) 267-8053'),
('Bella Grace Vineyards', 38.3938113, -120.8034416, '73 Main St, Sutter Creek, CA 95685', '11:00AM-5:00PM Fri-Sun', 'http://www.bellagracevineyards.com/', '(209) 245-6150'),
('Convergence Vineyards', 38.4256891, -120.8750153, '14650 CA-124, Plymouth, CA 95669', '10:00AM-5:00PM Fri-Sun', 'https://www.convergencevineyards.com/', '(209) 245-3600')
;

INSERT INTO wine (wineryid, winename, vintage, varietal) VALUES
(000001, '2013 Family Reserve Zinfandel', 2013, 'Zinfandel'),
(000001, '2012 Zinfandel -- Library Selection', 2012, 'Zinfandel'),
(000001, '2016 Sauvignon Blanc', 2016, 'Sauvignon Blanc'),
(000002, 'Reserve Chardonnay', 2015, 'Chardonnay'),
(000002, '3 Graces White', 2014, 'White Blend'),
(000002, 'Reserve Petite Sirah', 2013, 'Petite Sirah'),
(000003, '2013 Cabernet Sauvignon', 2013, 'Cabernet Sauvignon'),
(000003, '2013 Estate Zinfandel', 2013, 'Zinfandel')
;
