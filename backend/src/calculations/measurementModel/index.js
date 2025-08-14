const calcDistance = require('../calcDistance');

// * ↓ Global variables:
let ACCURATE_POINTS = [];
let DIRECTIONS = [];

const setMeasurement = (coords, sensor, environment) => {

    // * ↓ 0. GETTING PARAMS:
    const { angleStep: ANGLE_STEP, position: POSITION, direction: ORIGINAL_DIRECTION } = coords;

    // * ↓ 1. CALCULATE POSSIBLE ACCURATE POINTS:

    // * ↓ 1.1. Set new directions based on angle step:
    for (let i = ORIGINAL_DIRECTION; i < ORIGINAL_DIRECTION + (sensor.fieldOfView / 2); i += ANGLE_STEP) {
        if(i !== ORIGINAL_DIRECTION) DIRECTIONS.push(Math.round(i * 1000) / 1000);
    }
    for (let i = ORIGINAL_DIRECTION; i > ORIGINAL_DIRECTION - (sensor.fieldOfView / 2); i -= ANGLE_STEP) {
        DIRECTIONS.push(Math.round(i * 1000) / 1000);
    }
    DIRECTIONS.sort((a, b) => a - b);

    console.log('DIRECTIONS:', JSON.stringify(DIRECTIONS, null, 2)); 

    return {
        coords,
        sensor,
        environment
    }
}

module.exports = { setMeasurement };