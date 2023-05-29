// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

function callback(location) {
    document.getElementById("tagging-lat").value = location.latitude;
    document.getElementById("tagging-lon").value = location.longitude;
    document.getElementById("discovery-lat").value = location.latitude;
    document.getElementById("discovery-lon").value = location.longitude;

    let mm = new MapManager("sc6jpukJS5sAEagIHrhiRZpJuWexIsEQ");
    let imageElement = document.getElementById("mapView");
    imageElement.src = mm.getMapUrl(location.latitude, location.longitude, JSON.parse(imageElement.dataset.tags), 15);
}

function updateLocation() {
    let lat = document.getElementById("tagging-lat").value;
    let lon = document.getElementById("tagging-lon").value;
    
    if (lat === undefined || lat === "" || lat === "0") {
        console.log("Geolocating device...")
        LocationHelper.findLocation(callback);
    }
    
    let mm = new MapManager("sc6jpukJS5sAEagIHrhiRZpJuWexIsEQ");
    let imageElement = document.getElementById("mapView");
    imageElement.src = mm.getMapUrl(lat, lon, JSON.parse(imageElement.dataset.tags), 15);
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});