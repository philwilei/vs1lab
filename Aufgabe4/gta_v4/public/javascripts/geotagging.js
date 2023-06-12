// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

function callback(location) {
    document.getElementById("tagging-lat").value = location.latitude;
    document.getElementById("tagging-lon").value = location.longitude;
    document.getElementById("discovery-lat").value = location.latitude;
    document.getElementById("discovery-lon").value = location.longitude;

    renderMap(location.latitude, location.longitude);
}

function updateLocation() {
    let latElem = document.getElementById("tagging-lat");
    let lonElem = document.getElementById("tagging-lon");
    let lat = latElem.value;
    
    if (lat === undefined || lat === "" || lat === "0") {
        console.log("Geolocating device...")
        LocationHelper.findLocation(callback);
    } else {
        renderMap(latElem.value, lonElem.value);
    }
    
    return [latElem.value, lonElem.value];
}

function renderGeotags(taglist) {
    const geotagList = document.getElementById("discoveryResults");
    // Populate result list
    geotagList.replaceChildren(...taglist.map((geotag) => {
        let listElement = document.createElement("li");
        listElement.innerHTML = `${geotag.name} (${geotag.latitude}, ${geotag.longitude}) ${geotag.hashtag})`;
        return listElement;
    }));
    // Populate image element data-* tag
    document.getElementById("mapView").dataset.tags = JSON.stringify(taglist);
    renderMap(...updateLocation())
}

function renderMap(latitude, longitude) {
    let mm = new MapManager("sc6jpukJS5sAEagIHrhiRZpJuWexIsEQ");
    let imageElement = document.getElementById("mapView");
    imageElement.src = mm.getMapUrl(latitude, longitude, JSON.parse(imageElement.dataset.tags), 14);
}

async function handleTaggingForm(submitEvent) {
    submitEvent.preventDefault();
    const response = await fetch("/api/geotags", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            latitude: document.getElementById("tagging-lat").value,
            longitude: document.getElementById("tagging-lon").value,
            name: document.getElementById("tagging-name").value,
            hashtag: document.getElementById("tagging-tags").value
        })
    });

    if (!response.ok) {
        let errorMessageBox = document.getElementById("errorMessage");
        errorMessageBox.textContent = "An error occurred while trying to add the GeoTag.";
        errorMessageBox.style.display = "block";
        return;
    }

    let successMessageBox = document.getElementById("successMessage");
    successMessageBox.textContent = "New GeoTag has been added.";
    successMessageBox.style.display = "block";
    setTimeout(() => {
        successMessageBox.style.display = "none";
    }, 5000);
    renderGeotags(await (await fetch("/api/geotags")).json());
}

async function handleDiscoveryForm(submitEvent) {
    submitEvent.preventDefault();
    const [latitude, longitude] = updateLocation();
    const query = document.getElementById("discovery-query").value;
    let url = `/api/geotags?latitude=${latitude}&longitude=${longitude}`;
    if (query !== "")
        url += `&searchTerm=${encodeURIComponent(query)}`
    const response = await fetch(url);
    const responseBody = await response.json();
    renderGeotags(responseBody);
}

document.addEventListener("DOMContentLoaded", async () => {
    updateLocation();
    document.getElementById("tag-form").addEventListener("submit", handleTaggingForm);
    document.getElementById("discoveryFilterForm").addEventListener("submit", handleDiscoveryForm);
});

// https://github.com/Loigzorn/vs1lab/blob/master/Aufgabe4/gta_v4_template/public/javascripts/geotagging.js#L145