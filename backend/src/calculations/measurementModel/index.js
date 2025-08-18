// * ↓ Imports:
const calcDistance = require('../calcDistance');
const { setEnvironment } = require('../environmentModel');
const { sampleBeamMeasurement } = require('./methods/sampleBeamMeasurement');
const { calculateSimulatedPoint } = require('./methods/calculateSimulatedPoint');
const { calculateLikelihoodField } = require('./methods/calculateLikelihoodField');
const { calculateGlobalSimulatedPoint } = require('./methods/calculateGlobalSimulatedPoint');

// * ↓ Global variables:
let ACCURATE_POINTS = [];
let SIMULATED_POINTS = [];
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

    const w_hit = 0.65; // Probability of hit measurement
    const w_short = 0.2; // Probability of short measurement
    const w_max = 0.05; // Probability of max measurement
    const w_rand = 0.1; // Probability of random measurement

    // * ↓ 4. BEAM SIMULATION:

    // * ↓ 4.1. Fill SIMULATED_POINTS with accurate points data:
    SIMULATED_POINTS = ACCURATE_POINTS.map(point => ({
        direction: point.direction,
        accurate: point.point
    }));

    // * ↓ 4.2. Simulating hit measurements based on accurate points and sensor properties.
    SIMULATED_POINTS.forEach((point) => {
        if (point.accurate.distance > sensor.range) {
            console.log(`Skipping simulation for point ${point.direction}: distance ${point.accurate.distance} > sensor range ${sensor.range}`);
        } else {
            const simulatedDistance = sampleBeamMeasurement(point.accurate.distance, sensor.range, 0.2, 1.0, w_hit, w_short, w_max, w_rand);
            const simulatedCrossingPoint = calculateSimulatedPoint(POSITION, point.direction, simulatedDistance);
            
            point.simulation = {
                distance: simulatedDistance,
                crossingPoint: simulatedCrossingPoint
            };
            
            //console.log(`Wiązka ${point.direction}: idealne = ${point.accurate.distance}, zasymulowany pomiar = ${simulatedDistance}, crossingPoint = ${JSON.stringify(simulatedCrossingPoint)}`);
        }
    });

    // * ↓ 4.3 Simulate global reading based on discrete beams:

    // * ↓ 4.3.1 Likelihood for each beam:
    const params = { sigma_hit: 0.5 }; // np. 0.5m tolerancji

    SIMULATED_POINTS.forEach(point => {
        point.likelihood = calculateLikelihoodField(
            point.accurate,
            point.simulation,
            params
        );
    })

    SIMULATED_POINTS.forEach((point, index) => {
        //console.log(`Punkt ${index}: odczyt = ${point.simulation.distance}, oczekiwany = ${point.accurate.distance}, prawdopodobieństwo = ${point.likelihood}`);
    });

    // * ↓ 4.3.2 Simulate global crossing point based on likelihood:
    const globalSimulatedPoint = calculateGlobalSimulatedPoint(SIMULATED_POINTS, POSITION);
    console.log(`Global simulated point: ${JSON.stringify(globalSimulatedPoint)}`);
    

    // * ↓ 5. RETURN:
    return {
        accurate_including_range: ACCURATE_POINTS[0],
        simulation: SIMULATED_POINTS,
        globalSimulatedPoint: globalSimulatedPoint
    };
}

module.exports = { setMeasurement };