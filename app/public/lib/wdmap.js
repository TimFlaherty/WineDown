// Declare OpenStreetMap tiles
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	id: 'OpenStreetMap.Mapnik',
	//attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

// Declare map variable
var map;

//Declare global variable for map pins
var markers = new L.FeatureGroup();

//Declare mapping function
function mapit() {
	// Initialize map and center on Amador County (roughly)
	map = L.map('map', {
		center: [38.4, -120.8],
		zoom: 11,
		layers: [osm]
	});

	osm.addTo(map);

	// LOCATION
	function locate() {
		// Find user location
		map.locate({ setView: true, maxZoom: 12 });

		//Declare function to add pin at user location
		function onLocationFound(e) {
			L.marker(e.latlng).addTo(map)
				.bindPopup("You are here");
		}

		// Add location pin to map
		map.on('locationfound', onLocationFound);

		//If there is a location error, display the error
		function onLocationError(e) {
			alert(e.message);
		}

		map.on('locationerror', onLocationError);
	}

	//Locate map control
	var locator = L.Control.extend({
		options: {
			position: 'topright'
		},
		onAdd: function (map) {
			var container = L.DomUtil.create('div', 'locatebtn leaflet-bar leaflet-control leaflet-control-custom');

			container.style.backgroundColor = 'white';
			container.style.width = '35px';
			container.style.height = '35px';
			container.style.margin = '15px';
			container.innerHTML = '<img src="lib/locate.png" alt="Locate">';

			container.onclick = function () {
				locate();
			}
			return container;
		}
	});

	map.addControl(new locator());



	// MAP SEARCH FUNCTIONALITY
	// Initialize Google maps geocoder
	var geocoder = new google.maps.Geocoder();

	// API call to geocoder
	function googleGeocoding(text, callResponse) {
		geocoder.geocode({ address: text }, callResponse);
	}

	// Format API response
	function formatJSON(rawjson) {
		var json = {},
			key, loc, disp = [];

		for (var i in rawjson) {
			key = rawjson[i].formatted_address;
			loc = L.latLng(rawjson[i].geometry.location.lat(), rawjson[i].geometry.location.lng());
			json[key] = loc;	//key,value format
		}

		return json;
	}

	// Add search control to map
	map.addControl(new L.Control.Search({
		sourceData: googleGeocoding,
		formatData: formatJSON,
		markerLocation: true,
		autoType: false,
		autoCollapse: true,
		minLength: 2
	})
	);
}

// WINERY PINS
// AJAX request to node server returns an array of winery data 
function pins(x) {
	markers.clearLayers();
	$.ajax({
		url: '/winerypins?' + x,
		type: 'get',
	}).done(function (data) {
		for (i = 0; i < data.length; i++) {
			var linkaddr = data[i].address.split(' ').join('+');
			
			//If there is no winery rating available, display message
			var rating = data[i].wineryrating;
			if (rating == null) {
				rating = "Be the first to review!";
			}
			//If there is no varietal information available, display message
			var varietals = data[i].varietals;
			if (varietals == null) {
				varietals = "Be the first to review!";
			}
			// For each winery i, grab coordinates, drop a marker, and populate the marker data
			var marker = L.marker([data[i].lat, data[i].lng])
				.bindPopup("<a href='winery?wineryid=" + data[i].wineryid + "'><h3>" + data[i].wineryname + "</h3></a>"
				+ "<b>Tasting Room Hours:</b><br>"
				+ data[i].hours
				+ "<br><br><b>Varietals:</b><br>"
				+ varietals
				+ "<br><br><b>WineDown Rating: </b><br>"
				+ rating
				+ "<br><br><a href='https://www.google.com/maps/dir/?api=1&destination=" 
				+ linkaddr
				+ "' target='_blank'>Directions</a>"
				);
			
			markers.addLayer(marker);
			map.addLayer(markers);
		};
	});
}


//adds options to dropdowns for varietals and wineryname
function selector() {
	$.ajax({	//gets varietal dropdown options
		url: '/opts',
		type: 'get',
	}).done(function (data) {
		for (i = 0; i < data.length; i++) {
			$('#opts').append($('<option>', {
				value: data[i].varietal,
				text: data[i].varietal
			})
			);
		};
	});
	$.ajax({	//gets wineryname dropdown options
		url: '/optnames',
		type: 'get',
	}).done(function (data) {
		for (i = 0; i < data.length; i++) {
			$('#optnames').append($('<option>', {
				value: data[i].wineryname,
				text: data[i].wineryname
			}));
		};
	});
}



//for filtering pins, specifies categories
function filter() {
	pins('varietal=' + $('#opts').val());
}
function filterWineryName() {
	pins('wineryname=' + $('#optnames').val());
}