import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCalc } from '../../features/CalcsSlice';
import { IoCalculatorOutline } from "react-icons/io5";
import { usePostRequest } from '../../hooks';
import { verifyRequestData } from '../../utils/validation/formValidation';
import { prepareDatapack, prepareApiRequestBody } from '../../utils/dataTransform';

const CalculateButton = ({ 
    selectedSensor, 
    onValidationError, 
    validateInputs,
    showValidationErrors 
}) => {
    const dispatch = useDispatch();
    const { postData, loading } = usePostRequest();
    
    // Redux selectors
    const objects = useSelector((state) => state.form.objects.selectedObjects);
    const positionX = useSelector((state) => state.form.sensorPosition.x);
    const positionY = useSelector((state) => state.form.sensorPosition.y);
    const direction = useSelector((state) => state.form.sensorPosition.direction);
    const angleStep = useSelector((state) => state.form.sensorPosition.angleStep);

    const handleCalculate = async () => {
        // * → Validation check
        const validation = validateInputs(selectedSensor, objects, direction);
        if (!validation.valid) {
            onValidationError(validation.message);
            showValidationErrors();
            return;
        }

        // * → Creating data:
        const datapack = prepareDatapack(selectedSensor, positionX, positionY, direction, angleStep, objects);

        // * → Data verification:
        const result = verifyRequestData(datapack);
        if (result?.error) {
            onValidationError(result.errorMessage);
            return;
        }

        // * → Sending requests:
        try {
            const requestBody = prepareApiRequestBody(datapack);
            const response = await postData('/api/calc/distance', requestBody, {
                onSuccess: (response) => {
                    console.log('Response:', response);
                    if (response) {
                        console.log('Adding calc:', response);
                        dispatch(addCalc(response));
                    }
                },
                onError: (err) => {
                    console.log('Error:', err);
                    onValidationError(err);
                }
            });
        } catch (error) {
            console.error('Calculate error:', error);
        }
    };

    const isCalculateDisabled = () => {
        const validation = validateInputs(selectedSensor, objects, direction);
        return !validation.valid || loading;
    };

    return (
        <button
            className={`mt-0.5 mb-0 ${isCalculateDisabled() ? 'opacity-50 cursor-not-allowed bg-gray-300' : 'bg-accent'}`}
            disabled={isCalculateDisabled()}
            onClick={handleCalculate}
        >
            <div className="flex flex-row items-center justify-center space-x-0.5">
                <IoCalculatorOutline className="text-xl" />
                <p>{loading ? 'Calculating...' : 'Calculate'}</p>
            </div>
        </button>
    );
};

export default CalculateButton;
