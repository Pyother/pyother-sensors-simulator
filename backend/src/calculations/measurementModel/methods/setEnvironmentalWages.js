// * Imports:
const materials = require('../../../configuration/materials');

const setEnvironmentalWages = (accurateDistances = []) => {

    accurateDistances.sort((a, b) => a.distance - b.distance);

    accurateDistances.forEach((item, index) => {
        const significance = (1 - (item.distance / accurateDistances[accurateDistances.length - 1].distance)) * 100;
        item.sigma = significance;
    });
};

module.exports = setEnvironmentalWages;