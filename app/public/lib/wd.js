//Check if user is logged in and load appropriate button
	function logcheck(){
		$.ajax({url: '/logcheck', 
			type: 'get'
		}).done(function (data) {
			if (typeof data == 'string') {
				$("#login").html(
					'<a href="/user?userid='+data+'" id="profilelink"><button class="btn btn-outline-light my-2 my-sm-0">My Profile</button></a>' +
					'<button class="btn btn-outline-light my-2 my-sm-0" onclick="logout()">Log Out</button>'
				);
			} else if (data == false){
				$("#login").html('<button class="btn btn-outline-light my-2 my-sm-0" data-toggle="modal" data-target="#logmod">Login</button>');
			}
		});
	}

//User login function
function login(){
	$("#resultmsg").html('<img src="lib/loading.gif" alt="Please wait...">');
	var name = $("#uname").val();
	var pass = $("#pwd").val();
	$.ajax({url: '/login', 
		type: 'post',
		data: {
			uname: name,
			pwd: pass
		}
	}).done(function (data) {
		if(typeof data == 'string') {
			$("#login").html(
				'<a href="/user?userid='+data+'" id="profilelink"><button class="btn btn-outline-light my-2 my-sm-0">My Profile</button></a>' +
				'<button class="btn btn-outline-light my-2 my-sm-0" onclick="logout()">Log Out</button>'
			);
			modclose();
		} else if (data == false) {
			$("#resultmsg").html("Incorrect Password");
		}
	});
}

//User logout function
function logout(){
	$.ajax({url: '/logout', 
		type: 'get'
	}).done(function (data) {
		$("#login").html('<button class="btn btn-outline-light my-2 my-sm-0" data-toggle="modal" data-target="#logmod">Login</button>');
	});
}

//User signup function
function signup(){
	$("#resultmsg").html('<img src="lib/loading.gif" alt="Please wait...">');
	var name = $("#uname").val();
	var pass = $("#pwd").val();
	var mail = $("#email").val();
	$.ajax({url: '/signup', 
		type: 'post',
		data: {
			uname: name,
			pwd: pass,
			email: mail
		}
	}).done(function (data) {
		if(data == true) {
			$("#login").html('<button class="btn btn-outline-light my-2 my-sm-0" style="width:auto;" onclick="logout()">Log Out</button>');
			window.alert('Welcome to WineDown!');
			logcheck();
			modclose();
		} else {
			$("#resultmsg").html('Username already taken, sorry!');
		}
	});
}

function modclose() {
	$('#logmod').modal('hide');
	$('#resultmsg').html('');
	$('#addfield').html('');
	$("#modbutton").html('<button type="button" class="btn btn-light">Login</button>');
}

//Displays user signup dialog in modal box
function create() {
	$("#resultmsg").html('');
	$("#addfield").html('<br><h6>Email</h6><input type="email" class="form-control" placeholder="Enter Email" id="email" required>');
	$("#modbutton").html('<button type="submit" class="btn btn-light">Sign Up</button>');
}


function handlelogin() {
	if ($("#addfield").html() == '') {
		login();
	} else {
		signup();
	};
}