import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSensorDirection } from '../../features/SensorPositionSlice';
import FormSection from './FormSection';
import ValidationMessage from './ValidationMessage';

const DirectionInput = ({ showValidationMessages }) => {
    const dispatch = useDispatch();
    const direction = useSelector((state) => state.sensorPosition.direction);

    const isDirectionInvalid = direction && (parseFloat(direction) < -180 || parseFloat(direction) > 180);
    const isDirectionValid = direction !== '' && parseFloat(direction) >= -180 && parseFloat(direction) <= 180;

    return (
        <FormSection title="Direction">
            <input
                type="number"
                placeholder="Direction (degrees)"
                value={direction}
                onChange={(e) => dispatch(setSensorDirection(parseFloat(e.target.value) || 0))}
                min="-180"
                max="180"
                className={isDirectionInvalid ? 'border-red-500' : ''}
            />
            <ValidationMessage
                show={showValidationMessages && isDirectionInvalid}
                isValid={false}
                errorMessage="Direction must be between -180 and 180 degrees"
            />
            <ValidationMessage
                show={showValidationMessages && isDirectionValid}
                isValid={true}
                validMessage="Direction is valid."
            />
        </FormSection>
    );
};

export default DirectionInput;
