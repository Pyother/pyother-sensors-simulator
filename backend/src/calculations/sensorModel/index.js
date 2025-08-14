const options = require('../../configuration/options.json');

const setSensor = (sensorId) => {

    const sensor = options.availableSensors.find(s => s.id === sensorId);

    // * ↓ Sensor not found:
    if (!sensor) {
        return null;
    }

    // * ↓ Sensor found:    
    return sensor;
}

module.exports = { setSensor };