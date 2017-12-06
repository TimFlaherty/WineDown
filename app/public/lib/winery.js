//Check if user is logged in and load appropriate button
function logcheck(id){
	id = parseInt(id);
	$.ajax({url: '/logcheck', 
		type: 'get'
	}).done(function (data) {
		if (data == false) {
			var btn = "document.getElementById('id01').style.display='block'";
			$("#login").html('<button class="btn btn-outline-light my-2 my-sm-0" data-toggle="modal" data-target="#logmod">Login</button>');
			$("#rating").hide();
			$("#reviewbtn").html('<button class="btn btn-outline-success my-2 my-sm-0" data-toggle="modal" data-target="#logmod">Login to Review</button>');
		} else if (data == true){
			$("#login").html('<button class="btn btn-outline-light my-2 my-sm-0" onclick="logout()">Log Out</button>');
			$("#rating").show();
			$("#reviewbtn").html('<button class="btn btn-outline-success my-2 my-sm-0" onclick="wineryreview('+id+')">Rate It!</button>');
		}
	});
}

/* USER REVIEW FUNCTIONS */
//New winery review
function wineryreview(id){
	$("#reviewbtn").html('<img src="lib/loading.gif" alt="Please wait...">');
	var ratenum = $("#ratenum").val();
	var narr = $("#narrative").val();
	$.ajax({url: '/review', 
		type: 'post',
		data: {
			wineid: 'none',
			wineryid: id,
			rating: ratenum,
			narrative: narr
		}
	}).done(function (data) {
		if(data == true) {
			$("#reviewbtn").html('COOL');
		} else {
			$("#reviewbtn").html(data);
		}
	});
	wineryrvws(id);
}

//Display winery reviews
function wineryrvws(id) {
	$.ajax({url: '/wineryrvw?wineryid='+id, 
		type: 'get',
		}).done(function (data) {
		if(data.length==0) {
			$('#rvwtarget').html('Be the first to review!');
			$('#rvwtarget').css('height', '100px');
		} else {
			for (i=0;i<data.length;i++) {
				var rating = data[i].rating;
				if (rating == null) {
					rating = 'N/A';
				};
				$('#rvwtarget').append('<div class="rvwrow"><div class="row">'
					+'<div class="rating col-4"><h5><b>Rating: </b>'
					+rating+'</h5></div>'
					+'<div class="uname col-4"><a href="user?uname='+data[i].uname+'">'
					+data[i].uname+'</a></div><div class="rvwdate col-4">'
					+data[i].rvwdate+'</div></div><div class="narrative row col">'
					+data[i].narrative+'</div></div>'
				);
			};
		};
	});
}

/* DISPLAY WINES */
function wines(id) {
	$.ajax({url: '/wines?wineryid='+id, 
		type: 'get',
		}).done(function (data) {
		for (i=0;i<data.length;i++) {
			var rating = data[i].winerating;
			if (rating == null) {
				rating = 'N/A';
			};
			var vintage = data[i].vintage;
			if (vintage == 0) {
				vintage = 'NV';
			};
			var winename = data[i].winename;
			if (winename == 'NULL') {
				winename = vintage +' '+data[i].varietal;
			};
			$('#winetarget').append('<div class="winerow row">'
				+'<div class="wine col-5"><a href="wine?wineid='+data[i].wineid+'">'
				+winename+'</a></div><div class="vintage col-2">'
				+vintage+'</div><div class="varietal col-3">'
				+data[i].varietal+'</div><div class="winerating col-2">'
				+rating+'</div></div>'
			);
		};
	});
}

/* LOGIN-LOGOUT-SIGNUP FUNCTIONS */
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
		if(data == true) {
			$("#login").html('<button class="btn btn-outline-light my-2 my-sm-0" onclick="logout()">Log Out</button>');
			$("#rating").show();
			$("#reviewbtn").html('<button class="btn btn-outline-success my-2 my-sm-0" onclick="wineryreview()">Rate It!</button>');
			modclose();
		} else {
			$("#resultmsg").html(data);
		}
	});
}

//User logout function
function logout(){
	$.ajax({url: '/logout', 
		type: 'get'
	}).done(function (data) {
		logcheck();
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
			$("#resultmsg").html(data);
		}
	});
}

/* MODAL BOX */
function modclose() {
	$('#logmod').modal('hide');
	$('#resultmsg').html('');
	$('#addfield').html('');
	$("#modbutton").html('<button type="button" class="btn btn-light" onclick="login()">Login</button>');
}

//Displays user signup dialog in modal box
function create() {
	$("#resultmsg").html('');
	$("#addfield").html('<br><h6>Email</h6><input type="text" class="form-control" placeholder="Enter Email" id="email" required>');
	$("#modbutton").html('<button class="btn btn-light" onclick="signup()">Sign Up</button>');
}	