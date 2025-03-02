//? this will run on the client side

// https://www.mapbox.com/ -> instead trying to use leafletjs.com
// https://leafletjs.com/examples/quick-start/
const locations = JSON.parse(document.getElementById('map').dataset.locations);

console.log('locations: ', locations);


in views/tour.pug add

extends base
include _reviewCard
 
block append head
  link(rel='stylesheet' href='https://unpkg.com/leaflet@1.8.0/dist/leaflet.css'
   integrity='sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ==' crossorigin='')
  script(src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"
    integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=="
    crossorigin="")



// const locations = JSON.parse(document.getElementById('map').dataset.locations);
// console.log(locations);

// ----------------------------------------------
// Get locations from HTML
// ----------------------------------------------

const locations = JSON.parse(document.getElementById('map').dataset.locations);

// ----------------------------------------------
// Create the map and attach it to the #map
// ----------------------------------------------

const map = L.map('map', { zoomControl: false });

// ----------------------------------------------
// Add a tile layer to add to our map
// ----------------------------------------------

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// ----------------------------------------------
// Create icon using the image provided by Jonas
// ----------------------------------------------

var greenIcon = L.icon({
  iconUrl: '/img/pin.png',
  iconSize: [32, 40], // size of the icon
  iconAnchor: [16, 45], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -50], // point from which the popup should open relative to the iconAnchor
});

// ----------------------------------------------
// Add locations to the map
// ----------------------------------------------

const points = [];
locations.forEach((loc) => {
  // Create points
  points.push([loc.coordinates[1], loc.coordinates[0]]);

  // Add markers
  L.marker([loc.coordinates[1], loc.coordinates[0]], { icon: greenIcon })
    .addTo(map)
    // Add popup
    .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
      autoClose: false,
      className: 'mapPopup',
    })
    .on('mouseover', function (e) {
      this.openPopup();
    })
    .on('mouseout', function (e) {
      this.closePopup();
    })
    .openPopup();
});

// ----------------------------------------------
// Set map bounds to include current location
// ----------------------------------------------

const bounds = L.latLngBounds(points).pad(0.5);
map.fitBounds(bounds);

// Disable scroll on map
map.scrollWheelZoom.disable();

///////////////////
/*
In addition to the above response, you will need a couple modifications:

1.) Add this to your app.js file (use the exact URL to prevent access to your app from other unpkg scripts):

// ALLOW REQUESTS TO unpkg.com (Leaflet) app.use((req, res, next) => {   res.setHeader("Content-Security-Policy", "script-src 'self' https://unpkg.com/leaflet@1.9.4/dist/leaflet.css https://unpkg.com/leaflet@1.9.4/dist/leaflet.js");   next(); })

2.) Add this to your base.pug file:

    body 
        // HEADER
        include components/_header
 
        // CONTENT
        block content 
            h1 This is a placeholder heading
 
        // FOOTER
        include components/_footer
 
        // INCLUDING LEAFLET
        link(rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
            crossorigin="")
        script(src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
            crossorigin="")
 
        // RUN SCRIPT TO LOAD MAP
        script(src='/js/mapbox.js')    
3.) Add this to the mapbox.js file (I like the zoom feature):

/* eslint-disable */
 
// ----------------------------------------------
// Get locations from HTML
// ----------------------------------------------
 
const locations = JSON.parse(document.getElementById('map').dataset.locations);
 
// ----------------------------------------------
// Create the map and attach it to the #map
// ----------------------------------------------
 
const map = L.map('map', { zoomControl: false });
 
// ----------------------------------------------
// Add a tile layer to add to our map
// ----------------------------------------------
 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
 
// ----------------------------------------------
// Create icon using the image provided by Jonas
// ----------------------------------------------
 
var greenIcon = L.icon({
  iconUrl: '/img/pin.png',
  iconSize: [32, 40], // size of the icon
  iconAnchor: [16, 45], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -50], // point from which the popup should open relative to the iconAnchor
});
 
// ----------------------------------------------
// Add locations to the map
// ----------------------------------------------
 
const points = [];
locations.forEach((loc) => {
  // Create points
  points.push([loc.coordinates[1], loc.coordinates[0]]);
 
  // Add markers
  L.marker([loc.coordinates[1], loc.coordinates[0]], { icon: greenIcon })
    .addTo(map)
    // Add popup
    .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
      autoClose: false,
      className: 'mapPopup',
    })
    .on('mouseover', function (e) {
      this.openPopup();
    })
    .on('mouseout', function (e) {
      this.closePopup();
    })
    .openPopup();
});
 
// ----------------------------------------------
// Set map bounds to include current location
// ----------------------------------------------
 
const bounds = L.latLngBounds(points).pad(0.5);
map.fitBounds(bounds);
*/