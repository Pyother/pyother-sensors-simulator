// * Methods:
const setEnvironmentalWages = require('./methods/setEnvironmentalWages');

class Measurement {
    constructor(accurateDistances = [], sensor) {
        this.sensor = sensor;
        this.accurateDistances = accurateDistances.filter(
            item => item.distance < sensor.maxRange && item.distance > sensor.minRange
        );
    }

    getResult() {

    }
}

Measurement.prototype.setEnvironmentalWages = setEnvironmentalWages;


module.exports = Measurement;
