var Place = function (item) {
    this.lat = ko.observable(item.venue.location.lat);
    this.lng = ko.observable(item.venue.location.lng);
    this.name = ko.observable(item.venue.name);
    this.rating = ko.observable(item.venue.rating);
    this.pricing = ko.observable(item.venue.price.message);
}
var ViewModel = function () {
    self = this;

    //store places fetched from foursquare api
    self.places = ko.observableArray([]);
    //create a new blank array for all the listing markers
    self.markers = ko.observableArray([]);
    //Infowindow display
    var largeInfoWindow = new google.maps.InfoWindow();
    //Get the bounds of the map
    var bounds = new google.maps.LatLngBounds();
    // make an api call to get places 
    var data = {
        client_id: 'UFBYJUIXWCPYGOS4BGBCQKTLRMR2VIHDIKO4NSHSQM125DQR',
        client_secret: 'JHCF3AICMJQ4HYAJ5RJN1GGEK45B1B3KRQO20JZN0TZCBICG',
        ll: '6.5244, 3.3792',
        query: 'food',
        v: '20170801',
        limit: 10
    }

    $.ajax({
        type: "GET",
        contentType: 'application/json; charset=UTF-8',
        url: "https://api.foursquare.com/v2/venues/explore?limit=20&query=" + data.query + "&ll=" + data.ll + "&client_id=" + data.client_id + "&client_secret=" + data.client_secret + "&v=20140806&m=foursquare",
        //url: "https://api.foursquare.com/v2/venues/explore",
        //data: data,
        dataType: "jsonp",
        success: function (data) {
            // console.log(data.response.groups);
            for (var i = 0, groups = data.response.groups; i < groups.length; i++) {
                //console.log(groups[i]);
                for (var j = 0, place = groups[i].items; j < place.length; j++) {
                    self.places.unshift(new Place(place[j]));

                    //the following uses the places observable array to create a markers on initialise
                    var location = {
                        lat: place[j].venue.location.lat,
                        lng: place[j].venue.location.lng
                    };

                    var title = place[j].venue.name;
                    console.log(title + " " + JSON.stringify(location));
                    var marker = new google.maps.Marker({
                        map: map,
                        position: location,
                        title: title,
                        animation: google.maps.Animation.DROP,
                        id: j
                    });
                    //push marker into observable array
                    self.markers.push(marker);
                    //extend bounds for each marker
                    bounds.extend(marker.position)
                    //create an onclick to open an info window at each marker
                    marker.addListener("click", function () {
                        self.populateInfoWindow(this, largeInfoWindow);
                    });
                }
               
            }
             map.fitBounds(bounds);
        }
    });

    //This function populates an info window anytime a marker is clicked, we will
    //only only one infowindow which would populate at the clicked marker, and populate 
    //based on the markers position
    self.populateInfoWindow = function (marker, infowindow) {
        //check to make sure the info window in not open at this marker
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent("<div>" + marker.title + "</div>");
            infowindow.open(map, marker);
            // //make sure the marker property is cleared oif the info window is closed
            // infowindow.addListener("closeclick",function(){
            //     infowindow.setMarker(null);
            // });
        }

    }

    var styles = [{
        "featureType": "all",
        "elementType": "all",
        "stylers": [{
                "invert_lightness": true
            },
            {
                "saturation": 10
            },
            {
                "lightness": 30
            },
            {
                "gamma": 0.5
            },
            {
                "hue": "#435158"
            }
        ]
    }];

    //initiate the map
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 6.5244,
            lng: 3.3792
        },
        styles: styles,
        zoom: 14
    });
}

function init() {
    ko.applyBindings(new ViewModel());
}