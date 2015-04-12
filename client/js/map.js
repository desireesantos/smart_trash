

function initialize() {
 
    var options = {
        center: { lat: -29.978039, lng: -51.114759},
        zoom: 13
    };
        
    var map = new google.maps.Map(document.getElementById('map-canvas'), options);
        
    var markers = {};
    var infos = {};
    var infoWindow = null;
    var socket = io();
    
    socket.on('trash-init', function(data) {
        console.log('init', data);
        
        $.each(data, function(key, value) {
        
            // avoid double init
            if(markers[key]) return;
        
            markers[key] = new google.maps.Marker({
                position: new google.maps.LatLng(value.position.lat, value.position.lng),
                // title: 'Trash Id ' + key,
                icon: value.full ? '/img/full.png' : '/img/empty.png',
                map: map
            });
            
                 
            infos[key] = value;
           
            google.maps.event.addListener(markers[key], 'mouseover', function() {
                infoWindow = createInfoWindow(infos[key]);
                infoWindow.open(map, markers[key]);
            });
           
            google.maps.event.addListener(markers[key], 'mouseout', function() {
                infoWindow.close();
            });
            
        });
    });
    
    socket.on('trash-change', function(value) {
        console.log('change', value);
        var marker = markers[value.id];
        marker.setIcon(value.full ? '/img/full.png' : '/img/empty.png');
        marker.setAnimation(google.maps.Animation.BOUNCE);
        marker.setVisible(!$('#coleta').is('.active') || value.full);
        infos[value.id] = value;
        setTimeout(function() { marker.setAnimation(null); }, 1050);
    });
    
    $('#coleta').on('click', function() {
        var $el = $(this);
        $el.toggleClass('active');
        $.each(markers, function (key, marker) {
            marker.setVisible(!$el.is('.active') || infos[key].full);
        });
    });
    
}

function createInfoWindow(value) {

    var diff = moment().diff(moment(value.date), 'seconds');
    var time = diff > 60 ? moment(value.date).fromNow() : (diff + ' seconds ago');

    return new google.maps.InfoWindow({ content: 
        '<p>Identificação: ' + value.id + '</p>' + 
        '<p>Tipo: ' + value.type + '</p>' + 
        '<p>Última leitura: ' + time + '</p>' + 
        '<p>Sensor: ' + value.value + '</p>' + 
        (value.full ? '<p style="color:red; text-align: center; font-weight: bold;">Lixeira cheia</p>' : '')
    });
}

google.maps.event.addDomListener(window, 'load', initialize);