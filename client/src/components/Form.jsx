import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAvailableSensors } from '../features/ConfigSlice';
import { setMaterials } from '../features/MaterialsSlice';
import { setSelectedSensor } from '../features/FormSlice';
import { useGetRequest, useValidation } from '../hooks';
import { validateFormInputs } from '../utils/validation/formValidation';
import PositionInputs from './form/PositionInputs';
import DirectionInput from './form/DirectionInput';
import AngleStepInput from './form/AngleStepInput';
import SensorSelector from './form/SensorSelector';
import ObjectCreator from './form/ObjectCreator';
import CalculateButton from './form/CalculateButton';
import Modal from './Modal';

const Form = () => {
    const dispatch = useDispatch();
    
    // Redux selectors
    const selectedSensor = useSelector((state) => state.form.selectedSensor);
    const availableSensors = useSelector((state) => state.config.availableSensors) || [];
    const materials = useSelector((state) => state.materials.materials) || [];
    
    // Hooks
    const { showValidationMessages, showValidationErrors } = useValidation();
    
    // → API calls:
    const { data: configData } = useGetRequest('/api/config', {
        onSuccess: (data) => {
            dispatch(setAvailableSensors(data.availableSensors));
        },
        onError: (err) => {
            setError(err);
            setErrorModalOpen(true);
        }
    });

    const { data: materialsData } = useGetRequest('/api/materials', {
        onSuccess: (data) => {
            dispatch(setMaterials(data.surfacesParams));
        },
        onError: (err) => {
            setError(err);
            setErrorModalOpen(true);
        }
    });

    // → Local state:
    const [error, setError] = useState(null);
    const [errorModalOpen, setErrorModalOpen] = useState(false);

    const handleError = (error) => {
        setError(error);
        setTimeout(() => {
            setError(null);
        }, 5000);
    };

    return (
        <>
            <PositionInputs />
            
            <DirectionInput 
                showValidationMessages={showValidationMessages} 
            />
            
            <SensorSelector 
                availableSensors={availableSensors}
                showValidationMessages={showValidationMessages}
                selectedSensor={selectedSensor}
                setSelectedSensor={(sensor) => dispatch(setSelectedSensor(sensor))}
            />
            
            <AngleStepInput />
            
            <ObjectCreator 
                materials={materials}
                showValidationMessages={showValidationMessages}
            />

            {/* Error display */}
            {error && !errorModalOpen && (
                <p className="text-red-500 text-sm">
                    {error}
                </p>
            )}

            <CalculateButton 
                selectedSensor={selectedSensor}
                onValidationError={handleError}
                validateInputs={validateFormInputs}
                showValidationErrors={showValidationErrors}
            />

            {/* Error modal */}
            <Modal 
                title="Error"
                isOpen={errorModalOpen}
                closeEvent={() => {
                    setErrorModalOpen(false);
                    setError(null);
                }}
                itemsType="error"
                message={error}
            />
        </>
    );
};

export default Form;