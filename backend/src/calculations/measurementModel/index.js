// * ↓ Imports:
const calcDistance = require('../calcDistance');
const { setEnvironment } = require('../environmentModel');
const { sampleBeamMeasurement } = require('./methods/sampleBeamMeasurement');

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
    DIRECTIONS.push(ORIGINAL_DIRECTION); 
    for (
        let angle = -sensor.fieldOfView / 2;
        angle <= sensor.fieldOfView / 2 + 1e-9; 
        angle += ANGLE_STEP
    ) {
        if (angle > sensor.fieldOfView / 2) angle = sensor.fieldOfView / 2; 
        DIRECTIONS.push(
            Math.round((ORIGINAL_DIRECTION + angle) * 1000) / 1000
        );
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

    console.log('Dokładne punkty:', JSON.stringify(ACCURATE_POINTS, null, 2));

    const w_hit = 0.65; // Probability of hit measurement
    const w_short = 0.2; // Probability of short measurement
    const w_max = 0.05; // Probability of max measurement
    const w_rand = 0.1; // Probability of random measurement

    // * ↓ 4. BEAM SIMULATION:
    // Simulating hit measurements based on accurate points and sensor properties.
    for (let i = 0; i < ACCURATE_POINTS.length; i++) {
        const z_star_tk = ACCURATE_POINTS[i].point.distance;
        
        // ↓ Skip simulation if object is beyond sensor range
        if (z_star_tk > sensor.range) {
            console.log(`Skipping simulation for point ${i}: distance ${z_star_tk} > sensor range ${sensor.range}`);
            continue;
        }

        const z_tk = sampleBeamMeasurement(z_star_tk, sensor.range, 0.2, 1.0, w_hit, w_short, w_max, w_rand);
        console.log(`Wiązka ${i}: idealne = ${z_star_tk}, zasymulowany pomiar = ${z_tk}`);
    }

    // * ↓ 5. RETURN:
    return {
        accurate_including_range: ACCURATE_POINTS[0],
        simulation: {}
    };
}

module.exports = { setMeasurement };