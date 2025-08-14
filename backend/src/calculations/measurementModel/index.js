// * ↓ Imports:
const calcDistance = require('../calcDistance');
const { setEnvironment } = require('../environmentModel');

// * ↓ Global variables:
let ACCURATE_POINTS = [];
let DIRECTIONS = [];

const setMeasurement = (coords, sensor, environment) => {

    // * ↓ 0. CLEAR PREVIOUS RESULTS:
    ACCURATE_POINTS = [];
    DIRECTIONS = [];

    // * ↓ 1. GETTING PARAMS:
    const { angleStep: ANGLE_STEP, position: POSITION, direction: ORIGINAL_DIRECTION } = coords;

    // * ↓ 2. CALCULATE POSSIBLE ACCURATE POINTS:

    // * ↓ 2.1. Set new directions based on angle step:
    DIRECTIONS.push(ORIGINAL_DIRECTION); // Add original direction first
    for (let i = ORIGINAL_DIRECTION; i <= ORIGINAL_DIRECTION + (sensor.fieldOfView / 2); i += ANGLE_STEP) {
        if(i !== ORIGINAL_DIRECTION) DIRECTIONS.push(Math.round(i * 1000) / 1000);
    }
    for (let i = ORIGINAL_DIRECTION; i >= ORIGINAL_DIRECTION - (sensor.fieldOfView / 2); i -= ANGLE_STEP) {
        DIRECTIONS.push(Math.round(i * 1000) / 1000);
    }

    // * ↓ 2.2. Calculate accurate points for each direction:
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

    // * ↓ 3. SET ENVIRONMENT FOR EACH POINT:
    ACCURATE_POINTS.forEach((accuratePoint) => {
        accuratePoint.point.material = setEnvironment(accuratePoint.point);
        delete accuratePoint.point.crossingPointMaterial;
    });

    // * ↓ 3.1. Sort points by distance:
    ACCURATE_POINTS.sort((a, b) => {
        return a.point.distance - b.point.distance;
    });

    console.log('DEBUG ACCURATE_POINTS:', JSON.stringify(ACCURATE_POINTS, null, 2)); 

    // * ↓ 4. WAGES:


    // * ↓ 5. RETURN:
    return {
        accurate_including_range: ACCURATE_POINTS[0]
        simulation: {}
    };
}

module.exports = { setMeasurement };