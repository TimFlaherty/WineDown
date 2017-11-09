var express = require('express');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var mysql = require('mysql');

//Enter db credentials here as ('mysql://username:password@host/database'):
var connection = mysql.createConnection('mysql://yourusername:yourpassword@localhost/winedown');

//Declare app
var app = express();

//Initialize EJS templating engine
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

//bodyParser to interpret POST data
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//Declare database connection
connection.connect(function(err) {
	if (err) throw err
});

//Get winery data for map pin
app.get('/winerypins', function (req, res) {
	// Query MySQL database, kind of complex to get the varietal data for each winery but it works great
	connection.query('SELECT a.wineryid, a.wineryname, a.lat, a.lng, a.hours, GROUP_CONCAT(DISTINCT b.varietal SEPARATOR ", ") AS varietals FROM winery a JOIN wine b ON a.wineryid = b.wineryid GROUP BY b.wineryid', function(err, rows, fields) {
		res.send(rows);
	});
});

//Route and serve winery data to winery profile template page
app.get('/winery', function (req, res) {
	connection.query('SELECT * FROM winery WHERE wineryid=' + req.query.wineryid, function(err, rows, fields) {
		res.render(__dirname +'/public/winery.html', rows[0]);
	});
});

//Static file server for files in the /public folder
app.use(express.static(__dirname + '/public'));

//Serve to localhost:3000
app.listen(3000);

//Serve to local network on port 8000:
//app.listen(8000, 'your.local.ip.here');
//app.listen(8000, '192.168.0.12');
