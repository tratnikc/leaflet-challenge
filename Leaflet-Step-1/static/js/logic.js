// geojson data is loaded in the config file
// use allWeekURL from config.js

// radius multiplier
var radiusX = 6;

// grab data with d3
d3.json(allWeekURL, function (data) {
  console.log(data.features);
  console.log(data);

  var geojsonMarkerOptions = {
    radius: 8,  // this should be data.features.properties.mag
    fillColor: "#ff7800", // this should be a range of colors based on depth geometry.coordinates[2]
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

  // create features
  // create a geoJSON layer containing the features array on the earthquakes object
  var earthquakes = L.geoJSON(data.features, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * radiusX,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}<br>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
  }).addTo(myMap);



}); // d3.json

// create map layers
// streetmap
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

// darkmap
var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
});

// darkmap
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

// define baseMaps object to hold base layers
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap,
  "Outdoors": outdoors
};

// create overlay object to hold overlay layer
var overlayMaps = {
  // Earthquakes: earthquakes
};

// Creating map object, attach streetmap, 
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 5,
  layers: [streetmap]
});

// create a layer control
// pass baseMaps and overlayMaps
// add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

// set legend at bottom right of screen
var legend = L.control({
  position: 'bottomright'
});

// add legend
legend.onAdd = function (color) {
  var div = L.DomUtil.create('div', 'info legend');
  var levels = ['>1','1-2','2-3','3-4','4-5','5+'];
  var colors = ['#3c0','#9f6','#fc3','#f93','#c60','#c00'];
  for (var i=0; i < levels.length; i++) {
    div.innerHTML += '<li style="background:' + colors[i] + '"></li>' + levels[i] + '<br>';
  }
  return div;
}
legend.addTo(myMap);
 