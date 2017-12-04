//Include modules
var http = require('http');
var https = require('https');
var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

//Get SSL key & certificates from /certs folder
//var options = {
//	key: fs.readFileSync(__dirname+'/certs/server.key'),
//	cert: fs.readFileSync(__dirname+'/certs/server.crt')
//};

//Enter db credentials here as ('mysql://username:password@host/database'):
var connection = mysql.createConnection('mysql://root@localhost/winedown');

//Declare app
var app = express();

//Initialize EJS templating engine
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

//bodyParser to interpret POST data
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//cookieParser to interpret cookie data
app.use(cookieParser());

//Declare database connection
connection.connect(function (err) {
	if (err) throw err
});

//User sign-up
app.post('/signup', function (req, res) {
	var uname = req.body.uname;
	var pwd = req.body.pwd;
	var email = req.body.email;
	bcrypt.hash(pwd, null, null, function (err, hash) {
		connection.query('INSERT INTO usr(uname, pwd, email) VALUES ("' + uname + '", "' + hash + '", "' + email + '")', function (err, rows, fields) {
			if (err) {
				res.send('Username already taken, sorry!')
			} else {
				var uid = rows.insertId;
				res.cookie('winedown', { user: uid }).send(true);
			}
		});
	});
});

//User login; returns cookie with user id
app.post('/login', function (req, res) {
	var uname = req.body.uname;
	var pwd = req.body.pwd;
	connection.query('SELECT uid, pwd FROM usr WHERE uname = "' + uname + '"', function (err, rows, fields) {
		if (Object.keys(rows).length == 0) {
			res.send('Please enter a valid username.');
		} else {
			bcrypt.compare(pwd, rows[0].pwd, function (err, match) {
				if (match == true) {
					var uid = rows[0].uid;
					res.cookie('winedown', { user: uid }).send(true);
				} else {
					res.send('Incorrect Password');
				}
			});
		}
	});
});

//User logout deletes cookie
app.get('/logout', function (req, res) {
	res.clearCookie('winedown').send();
});

//Checks for user cookie and sends appropriate button
app.get('/logcheck', function (req, res) {
	var cookies = JSON.stringify(req.cookies);
	if (cookies.includes('winedown')) {
		res.send(true);
	} else {
		res.send(false);
	}
});

//Get winery data for map pin
//used by filter() and filterWineryName() in wdmap.js
app.get('/winerypins', function (req, res) {
	if (req.query.varietal !== undefined) {	//for varietal filter
		var varietal = req.query.varietal;
		if (varietal == 'all') {
			connection.query('SELECT * FROM winerypins', function (err, rows, fields) {
				res.send(rows);
			})
		} else {
			connection.query('SELECT * FROM winerypins WHERE varietal="' + varietal + '" GROUP BY wineryid', function (err, rows, fields) {
				res.send(rows);
			})
		}
	}
	else if (req.query.wineryname !== undefined){ //for wineryname filter
		var wineryname = req.query.wineryname; 
		if (wineryname == 'all') {
			connection.query('SELECT * FROM winerypins', function (err, rows, fields) {
				res.send(rows);
			})
		} else {
			connection.query('SELECT * FROM winerypins WHERE wineryname="' + wineryname +'"', function (err, rows, fields) {
				res.send(rows);
			})
		}
	}
});

//Get all varietals
app.get('/opts', function (req, res) {
	connection.query('SELECT DISTINCT varietal FROM wine ORDER BY varietal', function (err, rows, fields) {
		res.send(rows);
	});
});

//Get all winery names for selector() in wdmap.js
app.get('/optnames', function (req, res) {
	connection.query('SELECT wineryname FROM winery', function (err, rows, fields) {
		res.send(rows);
	});
});

//Route and serve winery data to winery profile template page
app.get('/winery', function (req, res) {
	connection.query('SELECT * FROM winery WHERE wineryid=' + req.query.wineryid, function (err, rows, fields) {
		res.render(__dirname + '/public/winery.html', rows[0]);
	});
});

//Get wines by wineryid
app.get('/wines', function (req, res) {
	connection.query('SELECT * FROM wines WHERE wineryid=' + req.query.wineryid, function (err, rows, fields) {
		res.send(rows);
	});
});

//Get winery reviews
app.get('/wineryrvw', function (req, res) {
	connection.query('SELECT * FROM wineryrvw WHERE wineryid=' + req.query.wineryid, function (err, rows, fields) {
		res.send(rows);
	});
});

//User reviews
app.post('/review', function (req, res) {
	var uid = req.cookies.winedown.user;
	var wineid = req.body.wineid;
	var wineryid = req.body.wineryid;
	var rating = req.body.rating;
	var narrative = req.body.narrative;
	console.log('newone');
	console.log(wineryid);
	//Differentiate between wine and winery reviews
	if (wineid == 'none') {
		var sql = 'INSERT INTO review(wineid, wineryid, uid, rating, narrative, rvwdate, rvwtime) VALUES (NULL, "' + wineryid + '", "' + uid + '", "' + rating + '", "' + narrative + '", CURDATE(), CURTIME())';
	} else {
		var sql = 'INSERT INTO review(wineid, wineryid, uid, rating, narrative, rvwdate, rvwtime) VALUES ("' + wineid + '", "' + wineryid + '", "' + uid + '", "' + rating + '", "' + narrative + '", CURDATE(), CURTIME())';
	}
	connection.query(sql, function (err, rows, fields) {
		if (err) {
			res.send('Something went wrong, sorry!')
		} else {
			res.send(true);
		}
	});
});

//Route and serve wine data to wine page template
app.get('/wine', function (req, res) {
	connection.query('SELECT a.wineid, a.wineryid, a.winename, a.vintage, a.varietal, b.wineryname FROM wine a JOIN winery b ON a.wineryid = b.wineryid AND a.wineid=' + req.query.wineid, function (err, rows, fields) {
		res.render(__dirname + '/public/wine.html', rows[0]);
	});
});

//Get wine reviews
app.get('/winervw', function (req, res) {
	connection.query('SELECT * FROM winervw WHERE wineid=' + req.query.wineid, function (err, rows, fields) {
		res.send(rows);
	});
});

//Route and serve user data to profile page template
app.get('/user', function (req, res) {
	connection.query('SELECT uid, uname FROM usr WHERE uname = "' + req.query.uname + '"', function (err, rows, fields) {
		res.render(__dirname + '/public/user.html', rows[0]);
	});
});

//Get user reviews for profile
app.get('/userrvws', function (req, res) {
	connection.query('SELECT * FROM profile WHERE uid=' + req.query.uid, function (err, rows, fields) {
		res.send(rows);
	});
});

//Get nearby wineries
app.get('/nearby', function (req, res) {
	var sql = 'SELECT wineryid, wineryname, lat, lng, hours, varietals, wineryrating,'
		+ 'ROUND(3959 * acos(cos(radians(' + req.query.lat
		+ ')) * cos(radians(lat)) * cos(radians(lng) - radians(' + req.query.long
		+ ')) + sin(radians(' + req.query.lat + ')) * sin(radians(lat ))), 1) AS distance '
		+ 'FROM winerypins GROUP BY wineryid ORDER BY distance LIMIT 5;';
	connection.query(sql, function(err, rows, fields) {
		res.send(rows);
	});
});

//Static file server for files in the /public folder
app.use(express.static(__dirname + '/public'));

//Serve HTTP to port 3000
http.createServer(app).listen(3000);

//Serve HTTPS to port 2000
//https.createServer(options, app).listen(2000);

//Serve to localhost:3000
//app.listen(3000);

//Serve to local network on port 8000:
//app.listen(8000, '192.168.0.7');

