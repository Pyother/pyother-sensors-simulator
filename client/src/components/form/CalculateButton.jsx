import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCalc } from '../../features/CalcsSlice';
import { IoCalculatorOutline } from "react-icons/io5";
import { usePostRequest } from '../../hooks';
import { verifyRequestData } from '../../utils/validation/formValidation';
import { prepareDatapack, prepareApiRequestBody } from '../../utils/dataTransform';

const CalculateButton = ({ 
    sensorsArray, 
    onValidationError, 
    validateInputs,
    showValidationErrors 
}) => {
    const dispatch = useDispatch();
    const { postData, loading } = usePostRequest();
    
    // Redux selectors
    const objects = useSelector((state) => state.objects.selectedObjects);
    const positionX = useSelector((state) => state.sensorPosition.x);
    const positionY = useSelector((state) => state.sensorPosition.y);
    const direction = useSelector((state) => state.sensorPosition.direction);
    const angleStep = useSelector((state) => state.sensorPosition.angleStep);

    const handleCalculate = async () => {
        // * → Validation check
        const validation = validateInputs(sensorsArray, objects, direction);
        if (!validation.valid) {
            onValidationError(validation.message);
            showValidationErrors();
            return;
        }

        // * → Creating data:
        const datapack = prepareDatapack(sensorsArray, positionX, positionY, direction, angleStep, objects);

        // * → Data verification:
        for (const data of datapack) {
            const result = verifyRequestData(data);
            if (result?.error) {
                onValidationError(result.errorMessage);
                return;
            }
        }

        console.log('Datapack:', datapack);

        // * → Sending requests:
        try {
            for (const dataItem of datapack) {
                const requestBody = prepareApiRequestBody(dataItem);
                const response = await postData('/api/calc/distance', requestBody, {
                    onSuccess: (response) => {
                        console.log('Response:', response);
                        dispatch(addCalc(response));
                    },
                    onError: (err) => {
                        console.log('Error:', err);
                        onValidationError(err);
                    }
                });
            }
        } catch (error) {
            console.error('Calculate error:', error);
        }
    };

    const isCalculateDisabled = () => {
        const validation = validateInputs(sensorsArray, objects, direction);
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
