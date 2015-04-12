

function initialize() {
 
    var options = {
        center: { lat: -29.978039, lng: -51.114759},
        zoom: 13
    };
        
    var map = new google.maps.Map(document.getElementById('map-canvas'), options);
        
    var markers = {};
    var info = {};
    var socket = io();
    
    socket.on('trash-init', function(data) {
        console.log('init', data);
        
        $.each(data, function(key, value) {
        
            // avoid double init
            if(markers[key]) return;
        
            markers[key] = new google.maps.Marker({
                position: new google.maps.LatLng(value.position.lat, value.position.lng),
                title: 'Trash Id ' + key,
                icon: value.empty ? '/img/empty.png' : '/img/full.png',
                map: map
            });
            
            info[key] = value;
           
            google.maps.event.addListener(markers[key], 'click', function() {
                createInfo(info[key]).open(map, markers[key]);
            });
            
        });
    });
    
    socket.on('trash-change', function(value) {
        console.log('change', value);
        var marker = markers[value.id];
        marker.setIcon(value.empty ? '/img/empty.png' : '/img/full.png');
        info[value.id] = value;
    });
    
}

function createInfo(value) {

    var diff = moment().diff(moment(value.date), 'seconds');
    var time = diff > 60 ? moment(value.date).fromNow() : (diff + ' seconds ago');

    return new google.maps.InfoWindow({ content: 
        '<p>Trash ID: ' + value.id + '</p>' + 
        '<p>Sensor: ' + value.value + '</p>' + 
        '<p>Last read: ' + time + '</p>' + 
        '<p>Counter read: ' + value.counter + '</p>' + 
        '<p>Trash full? ' + (!value.empty ? '<b style="color:red">yes</b>' : 'no') + '</p>'
    });
}

google.maps.event.addDomListener(window, 'load', initialize);

   