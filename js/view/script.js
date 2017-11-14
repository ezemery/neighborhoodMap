var Place = function (item) {
    this.lat = ko.observable(item.venue.location.lat);
    this.lng = ko.observable(item.venue.location.lng);
    this.name = ko.observable(item.venue.name);
    this.rating = ko.observable(item.venue.rating);
    this.id = ko.observable(item.venue.id);
    //this.pricing = ko.observable(item.venue.price.message);
}
var Food = function (item) {
    this.lat = ko.observable(item.venue.location.lat);
    this.lng = ko.observable(item.venue.location.lng);
    this.name = ko.observable(item.venue.name);
    this.rating = ko.observable(item.venue.rating);
    this.id = ko.observable(item.venue.id);
}

var ViewModel = function () {
    self = this;
    // Ajax start global function
    $(document).ajaxStart(function () {
        $(".mdl-spinner").show()
        console.log("Ajax Request is Starting");
    });
    // Ajax stop global function
    $(document).ajaxStop(function () {
        $(".mdl-spinner").hide()
        console.log("Ajax Request has ended");
    });
    //store places fetched from foursquare api
    self.places = ko.observableArray([]);
    self.food = ko.observableArray([]);
    //create a new blank array for all the listing markers
    self.placeMarkers = ko.observableArray([]);
    self.foodMarkers = ko.observableArray([]);
   
    //Infowindow display
    var largeInfoWindow = new google.maps.InfoWindow();
    //Get the bounds of the map
    var bounds = new google.maps.LatLngBounds();
    // make an api call to get places 
    var data = {
        client_id: 'UFBYJUIXWCPYGOS4BGBCQKTLRMR2VIHDIKO4NSHSQM125DQR',
        client_secret: 'JHCF3AICMJQ4HYAJ5RJN1GGEK45B1B3KRQO20JZN0TZCBICG',
        ll: '6.5244, 3.3792',
        query: 'Nightlife',
        query2: 'food',
        v: '20170801',
        limit: 10
    }

    //call api for places
    $.ajax({
        type: "GET",
        contentType: 'application/json; charset=UTF-8',
        url: "https://api.foursquare.com/v2/venues/explore?limit=5&query=" + data.query + "&ll=" + data.ll + "&client_id=" + data.client_id + "&client_secret=" + data.client_secret + "&v=20140806&m=foursquare",
        dataType: "jsonp",
        success: function (data) {
            //Customize icon
            var placesIcon = makeMarkerIcon('././images/heart2.png');
            for (var i = 0, groups = data.response.groups; i < groups.length; i++) {
                console.log(groups[i]);
                for (var j = 0, place = groups[i].items; j < place.length; j++) {
                    self.places.unshift(new Place(place[j]));

                    //the following uses the places observable array to create a markers on initialise
                    var location = {
                        lat: place[j].venue.location.lat,
                        lng: place[j].venue.location.lng
                    };

                    var title = place[j].venue.name;

                    var marker = new google.maps.Marker({
                        map: map,
                        position: location,
                        title: title,
                        animation: google.maps.Animation.DROP,
                        icon: placesIcon,
                        id: place[j].venue.id
                    });
                    //push marker into observable array
                    self.placeMarkers.push(marker);
                    //extend bounds for each marker
                    bounds.extend(marker.position)
                    //create an onclick to open an info window at each marker
                    marker.addListener("click", function () {
                        self.populateInfoWindow(this, largeInfoWindow);
                        console.log(this);
                    });
                    // Event that closes the Info Window with a click on the map
                    google.maps.event.addListener(map, 'click', function () {
                        largeInfoWindow.close();
                    });
                }

            }
            map.fitBounds(bounds);
        }
    });
    //call api for food
    $.ajax({
        type: "GET",
        contentType: 'application/json; charset=UTF-8',
        url: "https://api.foursquare.com/v2/venues/explore?limit=5&query=" + data.query2 + "&ll=" + data.ll + "&client_id=" + data.client_id + "&client_secret=" + data.client_secret + "&v=20140806&m=foursquare",
        dataType: "jsonp",
        success: function (data) {
            //Customize icon
            var foodIcon = makeMarkerIcon("././images/restaurant2.png");
            for (var i = 0, groups = data.response.groups; i < groups.length; i++) {
                console.log(groups[i]);
                for (var j = 0, place = groups[i].items; j < place.length; j++) {
                    self.food.unshift(new Food(place[j]));

                    //the following uses the places observable array to create a markers on initialise
                    var location = {
                        lat: place[j].venue.location.lat,
                        lng: place[j].venue.location.lng
                    };

                    var title = place[j].venue.name;

                    var marker = new google.maps.Marker({
                        map: map,
                        position: location,
                        title: title,
                        animation: google.maps.Animation.DROP,
                        icon: foodIcon,
                        id: place[j].venue.id
                    });
                    //push marker into observable array
                    self.foodMarkers.push(marker);
                    //extend bounds for each marker
                    bounds.extend(marker.position)
                    //create an onclick to open an info window at each marker
                    marker.addListener("click", function () {
                        self.populateInfoWindow(this, largeInfoWindow);
                        console.log(this);
                    });
                    // Event that closes the Info Window with a click on the map
                    google.maps.event.addListener(map, 'click', function () {
                        largeInfoWindow.close();
                    });
                }

            }
            map.fitBounds(bounds);
        }
    });
    //This function makes custom map icons
    function makeMarkerIcon(image) {
        var markerIcon = new google.maps.MarkerImage(image,
            new google.maps.Size(50, 50),
            // The origin for this image is (0, 0).
            new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            new google.maps.Point(0, 0));
        return markerIcon;
    }

    //This function populates an info window anytime a marker is clicked, we will
    //only only one infowindow which would populate at the clicked marker, and populate 
    //based on the markers position
    self.populateInfoWindow = function (marker, infowindow) {
        //check to make sure the info window in not open at this marker
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            //Clear the info window content to give googlemaps time to load
            infowindow.setContent('<img src="././images/44frgm.gif" alt="loader" width="100px" height="100px">');
            // //make sure the property is cleared if the info window is closed
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
            });
            $.ajax({
                type: "GET",
                contentType: 'application/json; charset=UTF-8',
                url: 'https://api.foursquare.com/v2/venues/' + marker.id + '?client_id=' + data.client_id + '&client_secret=' + data.client_secret + '&v=20140806&m=foursquare',
                dataType: "jsonp",
                success: function (data) {
                    console.log(data);
                }
            });

            infowindow.open(map, marker);
        }

    }

    //style google maps infowindow
    /* 
    https: //codepen.io/Marnoto/pen/xboPmG

    */
    google.maps.event.addListener(largeInfoWindow, 'domready', function () {
        // Reference to the DIV that wraps the bottom of infowindow
        var iwOuter = $('.gm-style-iw');
        /* Since this div is in a position prior to .gm-div style-iw.
         * We use jQuery and create a iwBackground variable,
         * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
         */
        var iwBackground = iwOuter.prev();

        // Removes background shadow DIV
        iwBackground.children(':nth-child(2)').css({
            'display': 'none',
        });

        // Removes white background DIV
        iwBackground.children(':nth-child(4)').css({
            'display': 'none',

        });
        // Changes the desired tail shadow color.
        iwBackground.children(':nth-child(3)').find('div').children().css({
            'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px',
            'z-index': '1'
        }); // Reference to the div that groups the close button elements.
        var iwCloseBtn = iwOuter.next();

        // Apply the desired effect to the close button
        iwCloseBtn.css({
            opacity: '1',
            right: '30px',
            top: '3px',
            border: '7px solid #d90653',
            'border-radius': '13px',
            'box-shadow': '0 0 5px #b30a48'
        });

        // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
        if ($('.iw-content').height() < 140) {
            $('.iw-bottom-gradient').css({
                display: 'none'
            });
        }
        // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
        iwCloseBtn.mouseout(function () {
            $(this).css({
                opacity: '1'
            });
        });


    });

    //This function binds the clicked menu to the marker info window
    self.getMarker = function (item) {
        for (var i = 0; i < self.placeMarkers().length; i++) {
            if (item.id() === self.placeMarkers()[i].id) {
                var selected = self.placeMarkers()[i];
                self.populateInfoWindow(selected, largeInfoWindow);
                break;
            }
        };
        for (var i = 0; i < self.foodMarkers().length; i++) {
            if (item.id() === self.foodMarkers()[i].id) {
                var selected = self.foodMarkers()[i];
                self.populateInfoWindow(selected, largeInfoWindow);
                break;
            }
        };
    }

    //styles for map
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
        zoom: 14,
        mapTypeId: 'roadmap'
    });

}

function init() {
    ko.applyBindings(new ViewModel());
}