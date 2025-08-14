// * Imports:
const calcObjectBoundaries = require('./calcObjectBoundaries');
const findCrossingPoint = require('./findCrossingPoint');
const { v4: uuidv4 } = require('uuid');

// * ↓ Global variables:
// Equational factors.
const BOUNDARIES = []; 
const CROSSING_POINTS = [];

const calcDistance = ({ position, direction, angleStep, sensor, inputObjects = [] }) => {

    // * Clear global arrays for each new calculation
    BOUNDARIES.length = 0;
    CROSSING_POINTS.length = 0;

    console.log('angleStep received:', angleStep); // Logowanie dla potwierdzenia

    // * ↓ 1. Boundaries:
    // Calculating boundaries for each object.
    inputObjects.forEach((object) => {
        const objectId = uuidv4(); 
        const inputObject = object?.inputObject || {};
        const objectBoundaries = calcObjectBoundaries({ inputObject });

        inputObject.id = objectId; 
        BOUNDARIES.push({
            objectId: objectId,
            objectBoundaries: objectBoundaries
        });
    });

    // * ↓ 2. Crossing points:
    // Calcuating crossing point for each object.
    BOUNDARIES.forEach((boundary) => {
        const crossingPoint = findCrossingPoint({ 
            position, 
            direction, 
            objectBoundaries: boundary.objectBoundaries 
        });
        if (crossingPoint) {
            CROSSING_POINTS.push({
                objectId: boundary.objectId,
                crossingPoint: crossingPoint
            });
        }
    })

    // * ↓ 3. Final output:
    // From the array of crossing points, we are taking the closest one to the sensor.

    // 3.1. No crossing points:
    if (CROSSING_POINTS.length === 0) {
        return null;
    }

    // 3.2. One crossing point:
    if (CROSSING_POINTS.length === 1) {
        return CROSSING_POINTS[0];
    }

    // 3.3. Multiple crossing points:
    CROSSING_POINTS.sort((a, b) => {
        const distanceA = Math.sqrt(
            Math.pow(a.crossingPoint.x - position.x, 2) +
            Math.pow(a.crossingPoint.y - position.y, 2)
        );
        const distanceB = Math.sqrt(
            Math.pow(b.crossingPoint.x - position.x, 2) +
            Math.pow(b.crossingPoint.y - position.y, 2)
        );
        return distanceA - distanceB;
    });
    //console.log('Output:', CROSSING_POINTS[0]);
    return CROSSING_POINTS[0];


}

module.exports = calcDistance;