const calcObjectBoundaries = require('./calcObjectBoundaries');
const findCrossingPoint = require('./findCrossingPoint');

const calcDistance = ({ position, direction, sensor, inputObject }) => {

    const objectBoundaries = calcObjectBoundaries({ inputObject });
    console.log(findCrossingPoint({ position, direction, objectBoundaries }));

}

calcDistance({
    position: { x: 0, y: 0 },
    direction: 60,
    sensor: { range: 500, angle: 45 },
    inputObject: [{x: 0, y: 10}, {x: 10, y: 10}]
});

module.exports = calcDistance;