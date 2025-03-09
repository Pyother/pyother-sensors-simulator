const calcObjectBoundaries = ({ inputObject }) => {

    const boundaries = [];

    inputObject.forEach((object, index) => {
        if(index !== inputObject.length - 1) {

            const nextObject = inputObject[index + 1];
            let [vertical, horizontal] = [false, false];
            let [a, b] = [0, 0];

            nextObject.x === object.x ?  
                vertical = { x: object.x } : 
                a = (nextObject.y - object.y) / (nextObject.x - object.x);
    
            nextObject.y === object.y ? 
                horizontal = { y: object.y } : 
                b = object.y - a * object.x;

            boundaries.push({ 
                start: { x: object.x, y: object.y },
                end: { x: nextObject.x, y: nextObject.y },
                line: { a, b, horizontal, vertical }
            });
        }
    })

    console.log('Boundaries:', boundaries);
    return boundaries;
}

module.exports = calcObjectBoundaries;

