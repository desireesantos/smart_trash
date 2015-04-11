 function initialize() {
        var mapOptions = {
          center: { lat: -29.978039, lng: -51.114759},
          zoom: 10
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
    
        $.get('/coleta/listall', function(data){
         $.each(data, function(key, value){
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(value.position.lat, value.position.lng),
            title: "Trash Can "+ key,
            icon: value.empty ? "/img/empty.png" : "/img/full.png",
            map: map
            });
         })
        }) 
  
   }
       google.maps.event.addDomListener(window, 'load', initialize);

   