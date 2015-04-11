 function initialize() {
        var mapOptions = {
          center: { lat: -29.978039, lng: -51.114759},
          zoom: 10
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
      
      //"/images/trash-full-1.png"
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(),
        title: "Lixeira 1",
        icon: "/images/trash-1.png",
        map: map
        });

   google.maps.event.addDomListener(window, 'load', initialize);