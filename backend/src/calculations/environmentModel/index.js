const materials = require('../../configuration/materials.json');

const setEnvironment = (object) => {

    const material = materials.surfacesParams.find(m => m.id === object.crossingPointMaterial);
    
    // * ↓ 1. Material not found:
    if (!material) {
        return null;
    }

    return material;
}

module.exports = { setEnvironment };