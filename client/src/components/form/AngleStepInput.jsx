import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSensorAngleStep } from '../../features/FormSlice';
import FormSection from './FormSection';

const AngleStepInput = () => {
    const dispatch = useDispatch();
    const angleStep = useSelector((state) => state.form.sensorPosition.angleStep);

    return (
        <FormSection title="Angle step">
            <input
                type="number"
                placeholder="Angle step (degrees)"
                value={angleStep}
                min="0.1"
                max="5"
                step="0.1"
                onChange={(e) => {
                    const value = parseFloat(e.target.value) || 1;
                    const clampedValue = Math.min(Math.max(value, 0.1), 5);
                    dispatch(setSensorAngleStep(clampedValue));
                }}
            />
        </FormSection>
    );
};

export default AngleStepInput;
