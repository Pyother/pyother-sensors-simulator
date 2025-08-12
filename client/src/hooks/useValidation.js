import { useState } from 'react';

const useValidation = () => {
    const [showValidationMessages, setShowValidationMessages] = useState(false);

    const showValidationErrors = () => {
        setShowValidationMessages(true);
        setTimeout(() => {
            setShowValidationMessages(false);
        }, 5000);
    };

    const validateCalculateInputs = (sensorsArray, objects, direction) => {
        if (sensorsArray.length === 0) {
            return { valid: false, message: 'At least one sensor must be selected' };
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

    const validateDirection = (direction) => {
        const directionValue = parseFloat(direction);
        return direction !== '' && !isNaN(directionValue) && directionValue >= -180 && directionValue <= 180;
    };

    const isDirectionInvalid = (direction) => {
        const directionValue = parseFloat(direction);
        return direction && (isNaN(directionValue) || directionValue < -180 || directionValue > 180);
    };

    return {
        showValidationMessages,
        showValidationErrors,
        validateCalculateInputs,
        validateDirection,
        isDirectionInvalid
    };
};

export default useValidation;
