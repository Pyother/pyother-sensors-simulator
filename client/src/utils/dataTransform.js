const prepareDatapack = (selectedSensor, positionX, positionY, direction, angleStep, objects) => {
    return {
        position: {
            x: parseFloat(positionX),
            y: parseFloat(positionY)
        },
        direction: parseFloat(direction),
        angleStep: parseFloat(angleStep),
        sensor: selectedSensor.id,
        inputObjects: objects.map(obj => ({
            id: obj.id,
            name: obj.name,
            material: obj.material,
            geometry: obj.geometry
        }))
    };
};

const prepareApiRequestBody = (data) => {
    return {
        position: {
            x: data?.position?.x,
            y: data?.position?.y
        }, 
        direction: data?.direction,
        angleStep: data?.angleStep,
        sensor: data?.sensor,
        inputObjects: (data?.inputObjects || []).map(obj => ({
            inputObject: obj.geometry || []
        }))
    };
};

export { prepareDatapack, prepareApiRequestBody };
