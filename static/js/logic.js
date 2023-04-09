
var myMap = L.map("map", {
    center: [0, 0],
    zoom: 2
});
  
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
  
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

var geojson;

d3.json(link).then(function(data) {
    
    console.log(data)
    
    geojson = L.choropleth(data, {
        
        valueProperty: function (feature) {
            return feature.geometry.coordinates[2]
        },
    
        scale: ["lightgreen", "red"],
        steps: 10,
        mode: "q",
        style: {
          color: "#fff",
          weight: 1,
          fillOpacity: 0.8
        },

        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 2,
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8})
        },
    
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<strong>" + feature.properties.title + "</strong>" + 
                "<br />Latitude: " + feature.geometry.coordinates[1] + 
                "<br />Longitude: " + feature.geometry.coordinates[0] + 
                "<br />Depth: " + feature.geometry.coordinates[2] + 
                "<br />Magnitude: " + feature.properties.mag);
        }
    }).addTo(myMap);
    
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = geojson.options.limits;
        var colors = geojson.options.colors;
        var labels = [];

        var legendInfo = "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

  legend.addTo(myMap);

});
