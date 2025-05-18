// * Imports: 
const calcAccurateDistance = require('./calcAccurateDistance');
const Sensor = require('./sensorModel/Sensor');
const Measurement = require('./measurementModel/Measurement');
const { v4: uuidv4 } = require('uuid');

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
 * @param {Array<Object>} inputObjects  → array of objects representing the environment.
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
    angleStep,            
    inputObjects = []           
}) => {

    // * ↓ Variables:
    // Equational factors. 
    let ACCURATE_DISTANCES = [];
    let SENSOR;

    // * ↓ 0. Data preparation:
    inputObjects.forEach((object) => object.id = uuidv4());

    // * ↓ 1. Sensor: 
    // Initializing the sensor object.
    SENSOR = new Sensor(sensor);

    // * ↓ 2. Accurate distance:
    // Calculation of the accurate distance for all angle steps in sensor's field of view.
    if(SENSOR.fieldOfView && angleStep <= 1) {
        for (let angle = -SENSOR.fieldOfView / 2; angle <= SENSOR.fieldOfView / 2; angle += angleStep) {
            ACCURATE_DISTANCES.push(calcAccurateDistance({
                position: coords.position,
                direction: coords.direction + angle,
                sensor: SENSOR,
                inputObjects
            }));
        }
    } else {
        throw new Error(`Angle step must be less than or equal to 1 degree for sensors with a field of view.`);
    }

    // * ↓ 3. 
    //
    const MEASUREMENT = new Measurement(ACCURATE_DISTANCES, SENSOR);

    return MEASUREMENT.getResult();

};

module.exports = calculate;