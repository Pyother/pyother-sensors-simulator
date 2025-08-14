// * ↓ Imports:
const calcDistance = require('../calcDistance');
const { setEnvironment } = require('../environmentModel');

// * ↓ Global variables:
let ACCURATE_POINTS = [];
let DIRECTIONS = [];

const setMeasurement = (coords, sensor, environment) => {

    // * ↓ 0. GETTING PARAMS:
    const { angleStep: ANGLE_STEP, position: POSITION, direction: ORIGINAL_DIRECTION } = coords;

    // * ↓ 1. CALCULATE POSSIBLE ACCURATE POINTS:

    // * ↓ 1.1. Set new directions based on angle step:
    for (let i = ORIGINAL_DIRECTION; i <= ORIGINAL_DIRECTION + (sensor.fieldOfView / 2); i += ANGLE_STEP) {
        if(i !== ORIGINAL_DIRECTION) DIRECTIONS.push(Math.round(i * 1000) / 1000);
    }
    for (let i = ORIGINAL_DIRECTION; i >= ORIGINAL_DIRECTION - (sensor.fieldOfView / 2); i -= ANGLE_STEP) {
        DIRECTIONS.push(Math.round(i * 1000) / 1000);
    }

    // * ↓ 1.2. Calculate accurate points for each direction:
    DIRECTIONS.forEach((direction) => {
        const point = calcDistance({
            position: POSITION,
            direction: direction,
            angleStep: ANGLE_STEP,
            sensor: sensor,
            inputObjects: environment
        });
        if (point) {
            ACCURATE_POINTS.push({
                direction: direction,
                point: point
            });
        }  
    });

    // * ↓ 2. SET ENVIRONMENT FOR EACH POINT:
    ACCURATE_POINTS.forEach((accuratePoint) => {
        accuratePoint.point.material = setEnvironment(accuratePoint.point);
        delete accuratePoint.point.crossingPointMaterial;
    });

    console.log('DEBUG ACCURATE_POINTS:', JSON.stringify(ACCURATE_POINTS, null, 2)); 

    return {
        coords,
        sensor,
        environment
    }
}

module.exports = { setMeasurement };