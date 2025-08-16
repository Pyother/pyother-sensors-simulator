const calculateSimulatedPoint = (startPoint, direction, distance) => {
    const { x: startX, y: startY } = startPoint;

    const crossingPoint = {
        x: startX + distance * Math.cos(direction * (Math.PI / 180)),
        y: startY + distance * Math.sin(direction * (Math.PI / 180))
    }

    return crossingPoint;
}

console.log(JSON.stringify(calculateSimulatedPoint({ x: 0, y: 0 }, -120, 1), null, 2));