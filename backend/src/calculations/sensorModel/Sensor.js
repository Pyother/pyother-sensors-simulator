// * Imports:
const config = require('../../configuration/options.json');

class Sensor {
    constructor(sensorId) {
        const sensor = config.availableSensors.find(sensor => sensor.id === sensorId);  
        this.id = sensor.id;
        this.name = sensor.name;
        this.measurementType = sensor.measurementType;
        this.sensorType = sensor.sensorType;
        this.resolution = sensor.resolution;
        this.frequency = sensor.frequency;
        this.fieldOfView = sensor.fieldOfView;
        this.minRange = sensor.minRange;
        this.maxRange = sensor.maxRange;
        
        if (sensor) console.log(`Sensor ${this.name} initialized with ID: ${this.id}`);
        else {
            throw new Error(`Sensor with ID ${sensorId} not found.`);
        }  
    }
}

module.exports = Sensor;