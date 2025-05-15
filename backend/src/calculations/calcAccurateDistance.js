// * Imports:
const calcObjectBoundaries = require('./calcObjectBoundaries');
const findCrossingPoint = require('./findCrossingPoint');
const { v4: uuidv4 } = require('uuid');

const calcAccurateDistance = ({ position, direction, sensor, inputObjects = [] }) => {

    // * ↓ Variables:
    // Equational factors.
    const BOUNDARIES = []; 
    const CROSSING_POINTS = [];

    // * ↓ 1. Boundaries:
    // Calculating boundaries for each object.
    inputObjects.forEach((object) => {
        const inputObject = object?.inputObject || {};
        const objectBoundaries = calcObjectBoundaries({ inputObject });

        BOUNDARIES.push({
            objectId: object.id,
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

            const distance = Math.sqrt(
                Math.pow(crossingPoint.x - position.x, 2) +
                Math.pow(crossingPoint.y - position.y, 2)
            );

            CROSSING_POINTS.push({
                objectId: boundary.objectId,
                distance: distance,
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
    CROSSING_POINTS.sort((a, b) => a.distance - b.distance);
    
    return CROSSING_POINTS[0];

}

module.exports = calcAccurateDistance;