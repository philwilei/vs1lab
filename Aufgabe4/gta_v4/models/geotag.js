// File origin: VS1LAB A3

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {
    longitude;
    latitude;
    name;
    hashtag;

    constructor(latitude, longitude, name, hashtag) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.hashtag = hashtag;
    }
}

module.exports = GeoTag;
