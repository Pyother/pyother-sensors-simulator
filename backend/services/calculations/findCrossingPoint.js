const findCrossingPoint = ({ position, direction, objectBoundaries }) => {
    
    const sensorPath = {
        start: { x: position.x, y: position.y },
        line: { 
            a: Math.tan(direction),
            b: position.y - Math.tan(direction) * position.x,
            horizontal: direction === 0 || direction === 180 || direction === -180 ?
                { y: position.y } : false,
            vertical: direction === 90 || direction === -90 ?
                { x: position.x } : false
        }
    };

    const distances = [];

    objectBoundaries.forEach((boundary) => {

        const { start, end, line } = boundary;
        const intersection = findIntersection(sensorPath.line, line);

        if (intersection) {

            // Check if intersection occurs on the correct side of the sensor:
            if(checkDirection({ position, intersection, direction })) {
                
                // Check if intersection belongs to the boundary segment:
                if(segmentBelonging({ intersection, start, end })) {
                    distances.push(intersection);
                }
            }
        }
    });

    return distances;
}

const findIntersection = (line1, line2) => {
    
    if (line1.vertical && line2.vertical) {
        return null; // Równoległe pionowe
    }
    if (line1.vertical) {
        // Pierwsza prosta pionowa: x = line1.x
        const x = line1.x;
        const y = line2.a * x + line2.b;
        return { x, y };
    }
    if (line2.vertical) {
        // Druga prosta pionowa: x = line2.x
        const x = line2.x;
        const y = line1.a * x + line1.b;
        return { x, y };
    }

    if (line1.a === line2.a) {
        return null; // Proste równoległe
    }

    // Znajdywanie punktu przecięcia
    const x = (line2.b - line1.b) / (line1.a - line2.a);
    const y = line1.a * x + line1.b;

    return { x, y };

}

const checkDirection = ({ sensorPosition, intersection, direction }) => {

    const intersectionLower = sensorPosition.y > intersection.y;

    if (direction < 0 && direction > -180) {
        intersectionLower ? return true : return false;
    } if (direction > 0 && direction < 180) {
        intersectionLower ? return false : return true;
    } else {
        const intersectionLeft = sensorPosition.x > intersection.x;
        if(direction === 180 || direction === -180) {
            intersectionLeft ? return true : return false;
        } if (direction === 0) {
            intersectionLeft ? return false : return true;
        }
    }
}

const segmentBelonging = ({ point, start, end }) =>  {
    const isBetween = (a, b, c) => {
        return (a >= b && a <= c) || (a >= c && a <= b);
    };

    const isOnSegment = isBetween(point.x, start.x, end.x) && isBetween(point.y, start.y, end.y);
    return isOnSegment;
}



module.exports = findCrossingPoint;
