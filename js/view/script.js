var ViewModel = function () {

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
        url: "https://api.foursquare.com/v2/venues/explore?limit=10&query=" + data.query + "&ll=" + data.ll + "&client_id=" + data.client_id + "&client_secret=" + data.client_secret + "&v=20140806&m=foursquare",
        //url: "https://api.foursquare.com/v2/venues/explore",
        //data: data,
        dataType: "jsonp",
        success: function (data) {
            console.log(data);
        }
    });

    var styles = [
        {
            "featureType": "all",
            "elementType": "all",
            "stylers": [
                {
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
        }
    ]

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.7413549,
            lng: -73.9980244
        },
        //styles:styles,
        zoom: 12
    });


}

function init() {
    ko.applyBindings(new ViewModel());
}