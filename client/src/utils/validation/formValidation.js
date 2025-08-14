// Przeniesiona logika z verifyData.js
const verifyRequestData = (data) => {
    
    // * → Position verification:
    if (!data.position) {
        return {
            error: true, 
            errorMessage: 'No position.'
        }
    } else if (!data.position.hasOwnProperty('x') || !data.position.hasOwnProperty('y')) {
        return {
            error: true, 
            errorMessage: 'Position should have x and y properties.'
        }
    } else if (typeof data.position.x !== 'number' || typeof data.position.y !== 'number') {
        return {
            error: true, 
            errorMessage: 'Position x and y should be numbers.'
        }
    } 

    // * → Direction verification:
    if (!data.direction && data.direction !== 0) {
        return {
            error: true, 
            errorMessage: 'No direction.'
        }
    } else if (typeof data.direction !== 'number') {
        return {
            error: true, 
            errorMessage: 'Direction should be a number.'
        }
    } else if (data.direction < -180 || data.direction > 180) {
        return {
            error: true, 
            errorMessage: 'Direction should be between -180 and 180 degrees.'
        }
    }

    // * → Angle step verification:
    if (!data.angleStep) {
        return {
            error: true, 
            errorMessage: 'No angle step.'
        }
    } else if (typeof data.angleStep !== 'number') {
        return {
            error: true, 
            errorMessage: 'Angle step should be a number.'
        }
    } else if (data.angleStep < 0.1 || data.angleStep > 5) {
        return {
            error: true, 
            errorMessage: 'Angle step should be between 0.1 and 5 degrees.'
        }
    }

    // * → Sensor verification:
    if (!data.sensor) {
        return {
            error: true, 
            errorMessage: 'No sensor.'
        }
    } else if (typeof data.sensor !== 'number') {
        return {
            error: true, 
            errorMessage: 'Sensor should be a number.'
        }
    } else if (data.sensor < 1) {
        return {
            error: true, 
            errorMessage: 'Sensor ID should be greater than 0.'
        }
    }

    return {
        error: false
    }
}

// Walidacja formularza UI
const validateFormInputs = (selectedSensor, objects, direction) => {
    if (!selectedSensor) {
        return { valid: false, message: 'A sensor must be selected' };
    }

    if (objects.length === 0) {
        return { valid: false, message: 'At least one object must be created' };
    }

    const directionValue = parseFloat(direction);
    if (isNaN(directionValue) || directionValue < -180 || directionValue > 180) {
        return { valid: false, message: 'Direction must be between -180 and 180 degrees' };
    }

    return { valid: true };
};

export { verifyRequestData, validateFormInputs };
