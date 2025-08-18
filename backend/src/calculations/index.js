// * Imports: 
const calcDistance = require('./calcDistance');
const { setSensor } = require('./sensorModel');
const { setMeasurement } = require('./measurementModel');

// * ↓ Global variables:
// Equational factors. 
let ACCURATE_DISTANCE = {};
let SENSOR = {};
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

        // * ↓ 2. SENSOR: 
        // Initializing the sensor object.
        SENSOR = setSensor(sensor);

        // ↓ 2.1. Check if sensor exists:
        if (!SENSOR) {
            return {
                accurate: null,
                simulation: null,
                error: 'Sensor not found'
            };
        }

        // * ↓ 3. SIMULATED DISTANCE CALCULATION:
        // 
        MEASUREMENT = setMeasurement(
            coords, 
            SENSOR, 
            environment
        );

        // ↓ 3.1. Check if measurement has an error:
        if (MEASUREMENT.error) {
            return {
                accurate: ACCURATE_DISTANCE,
                simulation: null,
                error: MEASUREMENT.error
            };
        }

        // * ↓ 4. RETURN:
        return {
            accurate: ACCURATE_DISTANCE,
            accurate_including_range: MEASUREMENT.accurate_including_range,
            simulation: MEASUREMENT.simulation,
            globalSimulatedPoint: MEASUREMENT.globalSimulatedPoint,
            error: null
        };
    }

    // Default fallback
    throw new Error(`Unsupported calculation type: ${calculationType}`);
};

module.exports = calculate;