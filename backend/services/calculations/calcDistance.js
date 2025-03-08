const calcObjectBoundaries = require('./calcObjectBoundaries');

const calcDistance = ({ position, direction, sensor, inputObject }) => {

    const objectBoundaries = calcObjectBoundaries({ inputObject });

    objectBoundaries.forEach((boundary) => {

    })

}

module.exports = calcDistance;