//Display user reviews
function userrvws(id) {
	$.ajax({url: '/userrvws?uid='+id, 
		type: 'get',
		}).done(function (data) {
		if(data.length==0) {
			$('#rvwtarget').html('No reviews yet');
			$('#rvwtarget').css('height', '100px');
		} else {
			$("#rvwnum").text(data.length);
			for (i=0;i<data.length;i++) {
				var wineurl = '<a href="wine?wineid='+data[i].wineid+'">'+data[i].winename+'</a>';
				var wineryurl = '<a href="winery?wineryid='+data[i].wineryid+'">'+data[i].wineryname+'</a>';
				var wname = wineurl + ' by ' + wineryurl;
				var wineid = data[i].wineid;
				if (wineid == null) {
					 wname = wineryurl;
				};
				$('#rvwtarget').append('<div class="rvwrow">'
					+'<div class="row"><div class="rating col-6"><h5><b>'
					+wname+'</b></h5></div><div class="uname col-2">'
					+data[i].rating+'</div><div class="rvwdate col-4">'
					+data[i].rvwdate+'</div></div><div class="narrative row col">'
					+data[i].narrative+'</div></div>'
				);
			};
		};
	});
}