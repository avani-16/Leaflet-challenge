
// Store API endpoint as queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data){
    // Once we get a response, send the data.features object to the createfeatures function.
    createfeatures(data.features);
});

function createfeatures(earthquakeData) {
         console.log(earthquakeData[0])

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3>
                         <hr><p>${new Date(feature.properties.time)}</p>
                         <hr><p>Magnitude: ${feature.properties.mag}</p>`);
        }
    
   
    // Create a function that reflect the magnitude of the earthquake by their 
        //size and the depth of the earthquake by color.

    function markerSize(magnitude){
        return magnitude * 5
    }
    function chooseColor(depth) {
        if (depth > 90){return "OrangeRed"}
        else if (depth > 70){return "DarkOrange"}
        else if (depth > 50){return "SandyBrown"}
        else if (depth > 30){return "Gold"}
        else if (depth > 10){return "Yellow"}
        else {return "GreenYellow";
      }}
    

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.    
    let earthquakes = L.geoJSON(earthquakeData, 
        {
            onEachFeature: onEachFeature,

            // Alter markers using Point to layer.
            pointToLayer : function (feature, latlng) {
                var geojsonMarkerOptions = {
                    radius: markerSize(feature.properties.mag),
                    fillColor: chooseColor(feature.geometry.coordinates[2]),
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                };
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
                               
            })               
    // Send our earthquakes layer to the createMap function
    createMap(earthquakes);
    }

    
function createMap(earthquakes) {
   
    // Create the base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });

    // Create a baseMaps object
    let baseMaps = {
        "Street Map" : street,
        "Topographic Map" : topo
    };

    // Create an overlay object to hold our overlay
    let overlayMaps = {
        Earthquakes : earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map",{
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Create a legend to display information about our map.
     let legend = L.control({
      position: "bottomright"
    });
  
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");
        let depthLabels = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
        let colors = ["GreenYellow", "Yellow", "Gold","SandyBrown", "DarkOrange", "OrangeRed"];
        div.style.backgroundColor = 'white'  
       // div.innerHTML = '<div style="background-color: white; width: 200px; height: 200px;"> Legend</div>';

        // Loop through the depthLabels and colors to create legend items
        for (let i = 0; i < depthLabels.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + colors[i] + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                (depthLabels[i]  + '<br>');
            
        }
    
        return div;
    };
    
    // Add the info legend to the map.
    legend.addTo(myMap);
 
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


}