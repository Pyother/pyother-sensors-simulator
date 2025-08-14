const materials = require('../../configuration/materials.json');

const setEnvironment = (environment) => {

    environment.forEach((object) => {

        const material = materials.surfacesParams.find(m => m.id === object.material);
        
        // * ↓ Material not found:
        if (!material) {
            return null;
        }

        // * ↓ Material found:
        object.material = material;
    })

    return environment;
}

module.exports = { setEnvironment };