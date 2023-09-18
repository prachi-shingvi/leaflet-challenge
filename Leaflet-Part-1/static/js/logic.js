let myMap = L.map("map", {
    center: [37.09,-95.71],
    zoom: 5
   
  });
  
// Adding the tile layer
  
  
// Use this link to get the GeoJSON data.
  let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  
// function to assign color based on depth
function getcolor(depth){
  if (depth <=10) {
    return '#90ee90'
  }
  if (depth <=30){
    return '#c0e740'
  }
  if (depth <=50){
    return '#ffe20b'
  }
  if (depth <=70){
    return '#f8a266'
  }
  if (depth <=90){
    return '#f57217'
  }
  return '#b44e07'
}

// Getting data from URL
d3.json(link).then(function(data){

console.log(data)
let markers=data.features.length

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

for (let i=0; i < markers;i++)
{
    L.circleMarker([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]],
    {
        draggable : false,
        radius : data.features[i].properties.mag * 4, // multiplying by 4 just to amplify the circle radius
        fillColor : getcolor(data.features[i].geometry.coordinates[2]), // getting color using getcolor function defined above
        color : 'black', // static radius color
        stroke: true, // to draw border
        weight: 1, // setting border width to 1
        opacity: .8, // setting border opacity
        fillOpacity: 1 // setting fill opacity
    }).bindPopup(`<strong>Magnitude:</strong> ${data.features[i].properties.mag}<hr> <strong>Location:</strong> ${data.features[i].properties.place}<hr> <strong>Depth:</strong> ${data.features[i].geometry.coordinates[2]}`)
    .addTo(myMap)

    
}

// Set up the legend.
let legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");
  const depth = [-10,10,30,50,70,90];
  div.innerHTML += "<h3>Depth</h3>"
  for (let i=0;i < depth.length;i++)
  {
    div.innerHTML += '<i style="background:' + getcolor(depth[i] + 1) + '"></i> &ensp;' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');

  }
  return div;
};

// Adding the legend to the map
legend.addTo(myMap);

});


