const calculateSimulatedPoint = (startPoint, direction, distance) => {
    const { x: startX, y: startY } = startPoint;

    const crossingPoint = {
        x: startX + distance * Math.cos(direction * (Math.PI / 180)),
        y: startY + distance * Math.sin(direction * (Math.PI / 180))
    }

    return crossingPoint;
}

module.exports = { calculateSimulatedPoint };