const verifyData = (data) => {
    
    // * → Position verification:
    // Position should be an object with x and y properties: { x: (number), y: (number) }. 
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
    // Direction should be a number representing the angle in degrees (0-360).
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
    // Angle step should be a number (0.1-5).
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
    // Sensor should be an number representing the sensor ID (1-?). // TODO
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

    // * → Input object verification:
    // TODO

    return {
        error: false
    }

}

export default verifyData;