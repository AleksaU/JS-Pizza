
var Pizza_Order = require('./pizza/PizzaOrder');

var styledMapType = new google.maps.StyledMapType(
    [
        {elementType: 'geometry', stylers: [{color: '#234f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: brown}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#754855'}]},
        {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{color: '#c9b2a6'}]
        },
        {
            featureType: 'administrative.land_parcel',
            elementType: 'geometry.stroke',
            stylers: [{color: '#dcd2be'}]
        },
        {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{color: '#ae9e90'}]
        },
        {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
        },
        {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#93817c'}]
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [{color: '#9bd77e'}]
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#76cb54'}]
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#f5f1e6'}]
        },
        {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [{color: '#fdfcf8'}]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#f8c967'}]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#e9bc62'}]
        },
        {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry',
            stylers: [{color: '#e98d58'}]
        },
        {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.stroke',
            stylers: [{color: '#db8555'}]
        },
        {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{color: '#806b63'}]
        },
        {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
        },
        {
            featureType: 'transit.line',
            elementType: 'labels.text.fill',
            stylers: [{color: '#8f7d77'}]
        },
        {
            featureType: 'transit.line',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#ebe3cd'}]
        },
        {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
        },
        {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{color: '#b8e0df'}]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#92998d'}]
        }
    ],
    {name: 'Pizza Map'});


var map;
var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers:true});
var directionService = new google.maps.DirectionsService();
function initialize() {
    var mapProp = {
        center: new google.maps.LatLng(50.464379, 30.519131),
        zoom: 15,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                'styled_map']
        }
    };
    var html_element = document.getElementById("googleMap");
    map = new google.maps.Map(html_element, mapProp);
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    // Marker pizza
    var point = new google.maps.LatLng(50.464379, 30.519131);
    var marker = new google.maps.Marker({
        position: point,
        map: map,
        icon: "assets/images/map-icon.png"
    });
    directionsDisplay.setMap(map);

    google.maps.event.addListener(map, 'click', function (me) {
        var coordinates = me.latLng;
        geocodeLatLng(coordinates, function (err, adress) {
            if (!err) {
                Pizza_Order.setAdress(adress);
                setMarker(coordinates);
                calculateRoute(new google.maps.LatLng(50.464379, 30.519131), coordinates, function (err, res) {
                    if (res) {
                        $(".order-summery-time").html("<b>Приблизний час доставки:</b> " + res);
                        $(".order-summery-adress").html("<b>Адреса доставки:</b> " + adress);
                    } else {
                        $(".order-summery-time").html("<b>Приблизний час доставки:</b> -/-");
                        $(".order-summery-adress").html("<b>Адреса доставки:</b> -/-");
                    }
                });
                Pizza_Order.checkAdress();
            } else {
                console.log("Can't find adress")
            }
        });
    });
}

function geocodeLatLng(latlng, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[1]) {
            var adress = results[1].formatted_address;
            callback(null, adress);
        } else {
            callback(new Error("Can't find adress"));
        }
    });
}

function geocodeAddress(adress, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': adress}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
            var coordinates = results[0].geometry.location;
            callback(null, coordinates);
        } else {
            callback(new Error("Can not find the adress"));
        }
    });
}

function getFullAddress(adress, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': adress}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
            var adress = results[0].formatted_address;
            callback(null, adress);
        } else {
            callback(new Error("Can not find the adress"));
        }
    });
}

function calculateRoute(A_latlng, B_latlng, callback) {
    directionService.route({
        origin: A_latlng,
        destination: B_latlng,
        travelMode: google.maps.TravelMode["DRIVING"]
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var leg = response.routes[0].legs[0];
            /*console.log(leg.duration.text);*/
            directionsDisplay.setDirections(response);
            callback(null, leg.duration.text);
        } else {
            callback(new Error("Cannot find direction"));
        }
    });
}

// Home marker
var homeMarker = null;
function setMarker(coordinates) {
    if (homeMarker) {
        homeMarker.setMap(null);
        homeMarker = null;
    }

    console.log(coordinates);

    homeMarker = new google.maps.Marker({
        position: coordinates,
        map: map,
        icon: "assets/images/home-icon.png"
    });
}


exports.initialize = initialize;
exports.geocodeAddress = geocodeAddress;
exports.setMarker = setMarker;
exports.calculateRoute = calculateRoute;
exports.geocodeLatLng = geocodeLatLng;
exports.getFullAddress = getFullAddress;