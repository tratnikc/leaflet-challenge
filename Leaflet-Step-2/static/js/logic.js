// last seven days
const quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// const tectonicURL = "../static/data/PB2002_plates.json";
const tectonicURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
const radiusX = 4;
console.log(quakeURL);
console.log(tectonicURL);

// read data
d3.json(tectonicURL, function (tectonicdata) {
  console.log(tectonicdata);

    d3.json(quakeURL, function (quakedata) {
      console.log(quakedata);

      createMap(quakedata, tectonicdata);

    }); // quakeURL
}); // tectonicURL

function createMap(data, plates) {

  var earthquakes = L.geoJSON(data.features, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * radiusX,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}<br>
      Depth: ${feature.geometry.coordinates[2]} <br>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
  });

  var tectoniclines = L.geoJSON(plates, {
    onEachFeature: function (feature, layer) {
      L.polyline(feature.geometry.coordinates);
    },
    style: function(feature) {
      return {
        color: "#2a52be",
        weight: 3,
        fillOpacity: 0
      };
    }
  });


  var greyscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  // satellite
  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  // outdoors
  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Satellite": satellite,
    "Grayscale": greyscale,
    "Outdoors": outdoors
  };

  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Fault Lines": tectoniclines
  };

  // create map object
  var myMap = L.map('map', {
    center: [34.0522, -118.2437],
    zoom: 5,
    layers: [satellite, earthquakes, tectoniclines]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  L.control.scale().addTo(myMap);

  // color to indicate depth
  function getColor(d) {
    return d > 90 ? '#b31b1b' : 
           d > 70 ? '#ff4040' : 
           d > 50 ? '#ed9121' : 
           d > 30 ? '#f8de7e' :
           d > 10 ? '#ccff00' :
                    '#00ff00';
  }

  // legend
  // set legend at bottom right of screen
  var legend = L.control({
    position: 'bottomright'
  });

  legend.onAdd = function (color) {
    var div = L.DomUtil.create('div', 'info legend');
    var levels = ['-10-10','10-30','30-50','50-70','70-90','90+'];
    var colors = ['#00ff00','#ccff00','#f8de7e','#ed9121','#ff4040','#b31b1b'];
    for (var i=0; i < levels.length; i++) {
      div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + levels[i] + '<br>';
    }
    return div;
  }

  legend.addTo(myMap);

}