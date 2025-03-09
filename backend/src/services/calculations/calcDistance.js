const calcObjectBoundaries = require('./calcObjectBoundaries');
const findCrossingPoint = require('./findCrossingPoint');

const calcDistance = ({ position, direction, sensor, inputObject }) => {

    const objectBoundaries = calcObjectBoundaries({ inputObject });
    //console.log(findCrossingPoint({ position, direction, objectBoundaries }));
    return findCrossingPoint({ position, direction, objectBoundaries })

}

module.exports = calcDistance;