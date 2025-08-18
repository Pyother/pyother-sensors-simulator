const calculateGlobalSimulatedPoint = (simulatedPoints, startPoint) => {
    if (!simulatedPoints || simulatedPoints.length === 0) {
        return null;
    }

    // Zamiana likelihood % na wagi (0–1)
    const weights = simulatedPoints.map(p => p.likelihood / 100);
    const weightSum = weights.reduce((a, b) => a + b, 0);

    if (weightSum === 0) {
        return null; // brak wiarygodnych odczytów
    }

    let sumX = 0;
    let sumY = 0;

    simulatedPoints.forEach((p, i) => {
        const w = weights[i] / weightSum; 

        // Wyznacz punkt przecięcia dla tej wiązki
        const crossingPoint = {
        x: startPoint.x + p.simulation.distance * Math.cos(p.direction * (Math.PI / 180)),
        y: startPoint.y + p.simulation.distance * Math.sin(p.direction * (Math.PI / 180))
        };

        // Skumuluj weighted average
        sumX += w * crossingPoint.x;
        sumY += w * crossingPoint.y;
    });

    return { x: sumX, y: sumY };
}

module.exports = { calculateGlobalSimulatedPoint };