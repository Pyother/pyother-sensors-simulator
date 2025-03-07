const calcObjectBoundaries = require('./calcObjectBoundaries');

const calcDistance = ({ position, direction, sensor, inputObject }) => {

    const sensorPath = {
        start: { x: position.x, y: position.y }
        line: { 
            a: Math.tan(direction),
            b: position.y - Math.tan(direction) * position.x,
            horizontal: direction === 0 || direction === 180 || direction === -180 ?
                { y: position.y } : false,
            vertical: direction === 90 || direction === -90 ?
                { x: position.x } : false
        }
    };

    const objectBoundaries = calcObjectBoundaries({ inputObject });
    const distances = [];

    

}

module.exports = calcDistance;