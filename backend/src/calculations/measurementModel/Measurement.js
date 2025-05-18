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
        setEnvironmentalWages(this.accurateDistances);
        this.accurateDistances.sort((a, b) => b.sigma - a.sigma);
        return this.accurateDistances[0];
    }
}

Measurement.prototype.setEnvironmentalWages = setEnvironmentalWages;

module.exports = Measurement;
