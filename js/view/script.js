var Place = function (item) {
    this.lat = ko.observable(item.venue.location.lat);
    this.lng = ko.observable(item.venue.location.lng);
    this.name = ko.observable(item.venue.name);
    this.rating = ko.observable(item.venue.rating);
    this.id = ko.observable(item.venue.id);
};
var Food = function (item) {
    this.lat = ko.observable(item.venue.location.lat);
    this.lng = ko.observable(item.venue.location.lng);
    this.name = ko.observable(item.venue.name);
    this.rating = ko.observable(item.venue.rating);
    this.id = ko.observable(item.venue.id);
};

var ViewModel = function () {
    self = this;
    //define the map variable
    var map;
    //store places fetched from foursquare api
    self.places = ko.observableArray([]);
    self.food = ko.observableArray([]);

    //create a new blank array for all the listing markers
    self.placeMarkers = ko.observableArray([]);
    self.foodMarkers = ko.observableArray([]);

    //observables for hiding or displaying markers
    self.foodChecked = ko.observable(true);
    self.placesChecked = ko.observable(true);

    //Infowindow display
    var largeInfoWindow = new google.maps.InfoWindow();


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
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 6.5244,
            lng: 3.3792
        },
        styles: styles,
        zoom: 14,
        mapTypeId: 'roadmap'
    });

    /* 
     make an api call to get places for nightlife and food recommended places.
     Advance this feature is the future to get user location and recommend places 
     to visit
    */

    //data for foursquare authentication
    var data = {
        client_id: 'UFBYJUIXWCPYGOS4BGBCQKTLRMR2VIHDIKO4NSHSQM125DQR',
        client_secret: 'JHCF3AICMJQ4HYAJ5RJN1GGEK45B1B3KRQO20JZN0TZCBICG',
        ll: '6.5244, 3.3792',
        query: 'Nightlife',
        query2: 'food',
        v: '20170801',
        limit: 10
    };

    //call api for places
    $.ajax({
        type: "GET",
        contentType: 'application/json; charset=UTF-8',
        url: "https://api.foursquare.com/v2/venues/explore?limit=10&query=" + data.query + "&ll=" + data.ll + "&client_id=" + data.client_id + "&client_secret=" + data.client_secret + "&v=20140806&m=foursquare",
        dataType: "jsonp",
        success: function (data) {

            //Customize icon for places
            var placesIcon = makeMarkerIcon('././images/heart2.png');
            for (var i = 0, groups = data.response.groups; i < groups.length; i++) {
                for (var j = 0, place = groups[0].items; j < place.length; j++) {
                    //the following uses the places observable array to create  markers on initialise
                    self.places.unshift(new Place(place[j]));

                    //get the recommended locations
                    var location = {
                        lat: place[j].venue.location.lat,
                        lng: place[j].venue.location.lng
                    };
                    //get the recommended titles of locations
                    var title = place[j].venue.name;

                    var marker = new google.maps.Marker({
                        position: location,
                        title: title,
                        animation: google.maps.Animation.DROP,
                        icon: placesIcon,
                        id: place[j].venue.id
                    });
                    //push marker into observable array
                    self.placeMarkers.push(marker);

                    //create an onclick to open an info window at each marker
                    functionPopulate();

                    //create an event listener to bounce markers on click
                    functionBounce();

                    // Event that closes the Info Window with a click on the map
                    closeInfo();
                }

            }

            //Populate info window on click
            function functionPopulate() {
                marker.addListener("click", function () {
                    self.populateInfoWindow(this, largeInfoWindow);
                });
            }
            //Show marker acrive state by bouncing when marker is clicked
            function functionBounce() {
                marker.addListener("click", function () {
                    self.toggleBounce(this);
                });
            }
            //close info window when map is clicked
            function closeInfo() {
                google.maps.event.addListener(map, 'click', function () {
                    largeInfoWindow.close();
                });
            }
        },
        error: function () {
            alert("We seem to have run into a problem trying to get Night hangouts, Try again later");
        }
    });

    //call api for food 
    $.ajax({
        type: "GET",
        contentType: 'application/json; charset=UTF-8',
        url: "https://api.foursquare.com/v2/venues/explore?limit=10&query=" + data.query2 + "&ll=" + data.ll + "&client_id=" + data.client_id + "&client_secret=" + data.client_secret + "&v=20140806&m=foursquare",
        dataType: "jsonp",
        success: function (data) {
            //Customize icon for food markers
            var foodIcon = makeMarkerIcon("././images/restaurant2.png");
            for (var i = 0, groups = data.response.groups; i < groups.length; i++) {
                for (var j = 0, place = groups[i].items; j < place.length; j++) {
                    //the following uses the places observable array to create a markers on initialise
                    self.food.unshift(new Food(place[j]));
                    //get the recomended location for food places
                    var location = {
                        lat: place[j].venue.location.lat,
                        lng: place[j].venue.location.lng
                    };
                    //get the title of the recommended places
                    var title = place[j].venue.name;

                    var marker = new google.maps.Marker({
                        position: location,
                        title: title,
                        animation: google.maps.Animation.DROP,
                        icon: foodIcon,
                        id: place[j].venue.id
                    });
                    //push marker into observable array
                    self.foodMarkers.push(marker);
                    //create an onclick to open an info window at each marker
                    functionPopulate();

                    //create an event listener to bounce markers on click
                    functionBounce();

                    // Event that closes the Info Window with a click on the map
                    closeInfo();
                }

            }
            //Populate info window on click
            function functionPopulate() {
                marker.addListener("click", function () {
                    self.populateInfoWindow(this, largeInfoWindow);
                });
            }
            //Show marker acrive state by bouncing when marker is clicked
            function functionBounce() {
                marker.addListener("click", function () {
                    self.toggleBounce(this);
                });
            }
            //close info window when map is clicked
            function closeInfo() {
                google.maps.event.addListener(map, 'click', function () {
                    largeInfoWindow.close();
                });
            }
        },

        error: function () {
            alert("We also ran into a problem trying to get food hangouts, Try again later");
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
    // toggle bounce on clicking marker
    self.toggleBounce = function (marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            window.setTimeout(function () {
                marker.setAnimation(null);
            }, 2000);
        }
        marker.addListener('closeclick', function () {
            marker.setAnimation(null);
        });
        // Event that closes the Info Window with a click on the map
        google.maps.event.addListener(map, 'click', function () {
            largeInfoWindow.close();
            marker.setAnimation(null);
        });


    };

    //This function populates an info window anytime a marker is clicked, we will
    //only only one infowindow which would populate at the clicked marker, and populate 
    //based on the markers position
    self.populateInfoWindow = function (marker, infowindow) {
        //Clear the info window content to give googlemaps time to load
        infowindow.setContent('<img src="././images/44frgm.gif" alt="loader" width="150px" height="150px">');
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
                // InfoWindow content
                var content = '<div id="iw-container">' +
                    '<div class="iw-title">' + data.response.venue.name + '</div>' +
                    '<div class="iw-content">' +
                    '<div class="iw-subTitle">' + data.response.venue.location.formattedAddress[0] + '</div>' +
                    '<img src="' + data.response.venue.bestPhoto.prefix + '200x200' + data.response.venue.bestPhoto.suffix + '" alt="Photo" height="83" width="83">' +
                    '<div class="iw-subTitle">' + data.response.venue.likes.summary + '</div>' +
                    '</div>';
                infowindow.setContent(content);
                console.log(data);
            },
            error: function () {
                infowindow.setContent('<p class="iw-subTitle">Oopps!, Please try again</p>');
            }
        });

        infowindow.open(map, marker);

    };

    //show or hide food markers if the the food is checked or not
    self.hideFoodMarkers = ko.computed(function () {
        if (self.foodChecked()) {
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < self.foodMarkers().length; i++) {
                // console.log(self.placeMarkers()[i]);
                self.foodMarkers()[i].setMap(map);
                self.foodMarkers()[i].setAnimation(google.maps.Animation.DROP);
                bounds.extend(self.foodMarkers()[i].position);
            }
            map.fitBounds(bounds);
            //always fit the markers to bounds on resizing screen
            google.maps.event.addDomListener(window, 'resize', function () {
                map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
            });
        } else {
            for (var j = 0; j < self.foodMarkers().length; j++) {
                self.foodMarkers()[j].setMap(null);
                //close infowindow if open
                largeInfoWindow.close();
            }
        }

    });
    //show or hide place markers if Nightlife is checked
    self.hidePlaceMarkers = ko.computed(function () {
        if (self.placesChecked()) {
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < self.placeMarkers().length; i++) {
                // console.log(self.placeMarkers()[i]);
                self.placeMarkers()[i].setMap(map);
                self.placeMarkers()[i].setAnimation(google.maps.Animation.DROP);
                bounds.extend(self.placeMarkers()[i].position);
            }
            map.fitBounds(bounds);
            //always fit the markers to bounds on resizing screen
            google.maps.event.addDomListener(window, 'resize', function () {
                map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
            });
        } else {
            var j;
            for (j = 0; j < self.placeMarkers().length; j++) {
                self.placeMarkers()[j].setMap(null);
                //close infowindow if open
                largeInfoWindow.close();
            }
        }

    });



    //This function binds the clicked menu to the marker info window
    self.getMarker = function (item) {
        var selected;
        var i;
        for (i = 0; i < self.placeMarkers().length; i++) {
            if (item.id() === self.placeMarkers()[i].id) {
                selected = self.placeMarkers()[i];
                self.populateInfoWindow(selected, largeInfoWindow);
                //create an event listener to bounce markers on click
                self.toggleBounce(selected);
                break;
            }
        }
        for (i = 0; i < self.foodMarkers().length; i++) {
            if (item.id() === self.foodMarkers()[i].id) {
                selected = self.foodMarkers()[i];
                self.populateInfoWindow(selected, largeInfoWindow);
                //create an event listener to bounce markers on click
                self.toggleBounce(selected);
                break;
            }
        }
    };


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
};

function init() {
    ko.applyBindings(new ViewModel());
}
function errorFn() {
    $("#map").css({
        'background-image': 'url("././images/error.png")',
        'background-size': 'cover'
    });
}