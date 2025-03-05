const calcObjectBoundaries = ({ inputObject }) => {

    const boundaries = [];

    inputObject.forEach((object, index) => {
        if(index !== inputObject.length - 1) {

            const a = inputObject[index + 1].x === object.x ? 0 :
                (inputObject[index + 1].y - object.y) / (inputObject[index + 1].x - object.x);
            const b = inputObject[index + 1].y === object.y ? 0 : object.y - a * object.x;

            boundaries.push({ 
                start: { x: object.x, y: object.y },
                end: { x: inputObject[index + 1].x, y: inputObject[index + 1].y },
                line: { a, b }
            });
        }
    })

    return boundaries;
}

console.log(calcObjectBoundaries({ inputObject: [{ x: 0, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }] }));

module.exports = calcObjectBoundaries;

