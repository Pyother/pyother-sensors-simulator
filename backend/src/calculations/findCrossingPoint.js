const findCrossingPoint = ({ position, direction, objectBoundaries }) => {

    const directionInRadians = direction * (Math.PI / 180);

    const sensorPath = {
        start: { x: position.x, y: position.y },
        line: { 
            a: Math.tan(directionInRadians),
            b: position.y - Math.tan(direction) * position.x,
            horizontal: (direction === 0 || direction === 180 || direction === -180) ?
                { y: position.y } : false,
            vertical: (direction === 90 || direction === -90) ?
                { x: position.x } : false
        }
    };

    console.log('Sensor path:', sensorPath);

    const distances = [];

    objectBoundaries.forEach((boundary) => {
        const { start, end, line } = boundary;
        const intersection = findIntersection(sensorPath.line, line);

        if (intersection) {
            
            // Check if intersection occurs on the correct side of the sensor:
            if (checkDirection({ sensorPosition: position, intersection, direction })) {

                // Check if intersection belongs to the boundary segment:
                if (segmentBelonging({ point: intersection, start, end })) {
                    distances.push(intersection);
                }
            }
        }
    });

    // Sorting distances to find the closest intersection point:
    distances.sort((a, b) => {
        const distanceA = Math.sqrt((a.x - position.x) ** 2 + (a.y - position.y) ** 2);
        const distanceB = Math.sqrt((b.x - position.x) ** 2 + (b.y - position.y) ** 2);
        return distanceA - distanceB;
    });

    // Returning the closest intersection point:
    return distances[0];
};

const findIntersection = (line1, line2) => {
    if (line1.vertical && line2.vertical) {
        return null; 
    }
    if (line1.horizontal && line2.horizontal) {
        return null; 
    }
    if (line1.vertical) {
        const x = line1.vertical.x;
        const y = line2.a * x + line2.b;
        return { x, y };
    }
    if (line2.vertical) {
        const x = line2.vertical.x;
        const y = line1.a * x + line1.b;
        return { x, y };
    }
    if (line1.horizontal) {
        const y = line1.horizontal.y;
        const x = (y - line2.b) / line2.a;
        return { x, y };
    }
    if (line2.horizontal) {
        const y = line2.horizontal.y;
        const x = (y - line1.b) / line1.a;
        return { x, y };
    }  
    if (line1.a === line2.a) {
        return null; 
    }

    const x = (line2.b - line1.b) / (line1.a - line2.a);
    const y = line1.a * x + line1.b;

    return { x, y };
};

const checkDirection = ({ sensorPosition, intersection, direction }) => {
    const intersectionLower = sensorPosition.y > intersection.y;

    if (direction < 0 && direction > -180) {
        return intersectionLower ? true : false;
    } else if (direction > 0 && direction < 180) {
        return intersectionLower ? false : true;
    } else {
        const intersectionLeft = sensorPosition.x > intersection.x;
        if (direction === 180 || direction === -180) {
            return intersectionLeft ? true : false;
        } else if (direction === 0) {
            return intersectionLeft ? false : true;
        }
    }
};

const segmentBelonging = ({ point, start, end }) =>  {
    
    const isBetween = (a, b, c) => {
        return (a >= b && a <= c) || (a >= c && a <= b);
    };

    return isBetween(point.x, start.x, end.x) && isBetween(point.y, start.y, end.y);
};

module.exports = findCrossingPoint;
