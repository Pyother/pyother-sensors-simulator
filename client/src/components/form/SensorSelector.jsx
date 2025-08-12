import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSensorFieldOfView } from '../../features/SensorPositionSlice';
import FormSection from './FormSection';
import ValidationMessage from './ValidationMessage';
import Modal from '../Modal';

const SensorSelector = ({ availableSensors, showValidationMessages, sensorsArray, setSensorsArray }) => {
    const dispatch = useDispatch();
    const [sensorsModalOpen, setSensorsModalOpen] = useState(false);

    const handleSensorSelect = (id, name) => {
        setSensorsArray(prev => {
            if (prev.some(s => s.id === id)) {
                return prev; 
            }
            
            // Find the selected sensor and set its fieldOfView
            const selectedSensor = availableSensors.find(sensor => sensor.name === name);
            if (selectedSensor && selectedSensor.fieldOfView) {
                dispatch(setSensorFieldOfView(selectedSensor.fieldOfView));
            }
            
            return [...prev, { id, name }];
        });
    };

    const handleSensorUnselect = (id) => {
        setSensorsArray(prev => {
            const newArray = prev.filter(s => s.id !== id);
            
            // If no sensors selected, reset fieldOfView to 0 (no drawing)
            if (newArray.length === 0) {
                dispatch(setSensorFieldOfView(0));
            } else {
                // Set fieldOfView from the first remaining sensor
                const remainingSensor = availableSensors.find(sensor => 
                    sensor.name === newArray[0].name
                );
                if (remainingSensor && remainingSensor.fieldOfView) {
                    dispatch(setSensorFieldOfView(remainingSensor.fieldOfView));
                }
            }
            
            return newArray;
        });
    };

    return (
        <>
            <FormSection title="Sensors">
                <ValidationMessage
                    show={showValidationMessages && sensorsArray.length === 0}
                    isValid={false}
                    errorMessage="Select at least one sensor."
                />
                <ValidationMessage
                    show={showValidationMessages && sensorsArray.length > 0}
                    isValid={true}
                    validMessage="Sensors selected."
                />
                <input
                    type="text"
                    placeholder="Sensor"
                    onClick={() => setSensorsModalOpen(true)}
                    value={
                        sensorsArray.length > 0 
                        ? sensorsArray.map(s => s.name).join(', ') 
                        : ''
                    }
                    onChange={() => {}}
                />
            </FormSection>

            {/* Sensor's modal */}
            <Modal 
                title="Available Sensors"
                isOpen={sensorsModalOpen}
                closeEvent={() => setSensorsModalOpen(false)}
                multipleSelections={true}
                itemsType="sensors"
                childrenArray={availableSensors}
                selectionsArray={sensorsArray}
                onSelect={handleSensorSelect}
                onUnselect={handleSensorUnselect}
            />
        </>
    );
};

export default SensorSelector;
