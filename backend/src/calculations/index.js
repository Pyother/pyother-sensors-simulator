// * Imports: 
const calcDistance = require('./calcDistance');
const { setSensor } = require('./sensorModel');
const { setEnvironment } = require('./environmentModel');
const { setMeasurement } = require('./measurementModel');

// * ↓ Global variables:
// Equational factors. 
let ACCURATE_DISTANCE = {};
let SENSOR = {};
let ENVIRONMENT = {};
let MEASUREMENT = {};

// * ↓ Main function
// Entry point for the calculations module.
/**
 * @param {string} calculationType      → type of calculation to be performed.
 * 
 * @param {string} sensor               → sensor's identifier, unique for each sensor.
 *
 * @param {Object} coords               → robot's coordinates in the cartesian plane.
 * 
 *                                          Structure:
 *                                          {
 *                                              "position": {
 *                                                  "x": {number}, 
 *                                                  "y": {number}  
 *                                              },
 *                                              "direction": {number} // (0-360)
 *                                          }
 *
 * @param {Array<Object>} environment   → array of objects representing the environment.
 * 
 *                                          Each object has the following structure:
 *                                          {
 *                                              "position": {         
 *                                                  "x": {number},    
 *                                                  "y": {number}     
 *                                              },
 *                                              "materialType": {string} // (e.g., "wood", "metal")
 *                                          }
 *
 * @returns {void}
 */


const calculate = ({
    calculationType,    
    sensor,              
    coords,             
    environment           
}) => {

    if (calculationType === 'distance') {

        // * ↓ 1. REAL (ACCURATE) DISTANCE CALCULATION:
        ACCURATE_DISTANCE = calcDistance({
            position: coords?.position,
            direction: coords?.direction,
            angleStep: coords?.angleStep,
            sensor: sensor,
            inputObjects: environment
        });

        // * ↓ 2. SENSORS AND ENVIRONMENT: 
        // Initializing the sensors and environment objects.
        SENSOR = setSensor(sensor);
        ENVIRONMENT = setEnvironment(environment);

        // ↓ 2.1. Check if sensor exists:
        if (!SENSOR) {
            return {
                accurate: null,
                simulation: null,
                error: 'Sensor not found'
            };
        }

        // ↓ 2.2. Check if environment is valid:
        if (!ENVIRONMENT || ENVIRONMENT.length === 0) {
            return {
                accurate: ACCURATE_DISTANCE,
                simulation: null,
                error: 'Could not match data with any material'
            };
        }

        // * ↓ 3. SIMULATED DISTANCE CALCULATION:
        // 
        MEASUREMENT = setMeasurement(
            coords, 
            SENSOR, 
            ENVIRONMENT
        );

        // * ↓ 4. RETURN:
        return {
            accurate: ACCURATE_DISTANCE,
            simulation: {},
            error: null
        };
    }

    // Default fallback
    throw new Error(`Unsupported calculation type: ${calculationType}`);
};

module.exports = calculate;