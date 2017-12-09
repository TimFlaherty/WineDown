/* SUGGESTION FUNCTIONS */
//New winery suggestion
function suggestwinery(){
	var wname = $("#wineryname").val();
	var addr = $("#address").val();
	var hrs = $("#hours").val();
	var site = $("#url").val();
	var phonenum = $("#phone").val();
	$.ajax({url: '/suggestwinery', 
		type: 'post',
		data: {
			name: wname,
			address: addr,
			hours: hrs,
			url: site,
			phone: phonenum
		}
	}).done(function (data) {
		if(data == true) {
			alert('Thank you for your suggestion!');
		} else {
			alert('There was a problem submitting your suggestion.\nPlease try again.');
		}
	});
}

//New wine suggestion
function suggestwine(){
	var wine = $("#wineName").val();
	var winery = $("#wineryName").val();
	var vint = $("#vintage").val();
	var vari = $("#varietal").val();
	$.ajax({url: '/suggestwine', 
		type: 'post',
		data: {
			winename: wine,
			wineryname: winery,
			vintage: vint,
			varietal: vari
		}
		console.log(data);
	}).done(function (data) {
		if(data == true) {
			alert('Thank you for your suggestion!');
		} else {
			alert('There was a problem submitting your suggestion.\nPlease try again.');
		}
	});
}