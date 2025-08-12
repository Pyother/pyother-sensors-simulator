import React from 'react';

const ValidationMessage = ({ show, isValid, validMessage, errorMessage }) => {
    if (!show) return null;

    if (isValid) {
        return (
            <p className="text-green-500 text-sm mb-1">
                ✓ {validMessage}
            </p>
        );
    } else {
        return (
            <p className="text-red-500 text-sm mb-1">
                {errorMessage}
            </p>
        );
    }
};

export default ValidationMessage;
