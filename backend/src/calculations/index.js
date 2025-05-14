// * Imports: 
const calcDistance = require('./calcDistance');

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
    inputObjects = []           
}) => {

    // * ↓ Variables:
    // Equational factors. 
    let ACCURATE_DISTANCE = {};

    // * ↓ 1. Real (accurate) distance calculation:
    // 
    ACCURATE_DISTANCE = calcDistance({
        position: coords.position,
        direction: coords.direction,
        sensor: sensor,
        inputObjects: inputObjects
    });

    // * ↓ 2. Sensors and Environment: 
    // Initializing the sensors and environment objects.


    // * ↓ 3. 

    return ACCURATE_DISTANCE;

};

module.exports = calculate;