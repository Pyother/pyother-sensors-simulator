import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSensorFieldOfView } from '../../features/FormSlice';
import FormSection from './FormSection';
import ValidationMessage from './ValidationMessage';
import Modal from '../Modal';

const SensorSelector = ({ availableSensors, showValidationMessages, selectedSensor, setSelectedSensor }) => {
    const dispatch = useDispatch();
    const [sensorsModalOpen, setSensorsModalOpen] = useState(false);

    const handleSensorSelect = (id, name) => {
        // Find the selected sensor and set its fieldOfView
        const selectedSensorData = availableSensors.find(sensor => sensor.id === id);
        if (selectedSensorData) {
            setSelectedSensor({ id, name });
            dispatch(setSensorFieldOfView(selectedSensorData.fieldOfView));
        }
    };

    const handleSensorUnselect = (id) => {
        if (selectedSensor && selectedSensor.id === id) {
            setSelectedSensor(null);
            dispatch(setSensorFieldOfView(0));
        }
    };

    return (
        <>
            <FormSection title="Sensors">
                <ValidationMessage
                    show={showValidationMessages && !selectedSensor}
                    isValid={false}
                    errorMessage="Select a sensor."
                />
                <ValidationMessage
                    show={showValidationMessages && selectedSensor}
                    isValid={true}
                    validMessage="Sensor selected."
                />
                <input
                    type="text"
                    placeholder="Sensor"
                    onClick={() => setSensorsModalOpen(true)}
                    value={selectedSensor ? selectedSensor.name : ''}
                    onChange={() => {}}
                />
            </FormSection>

            {/* Sensor's modal */}
            <Modal 
                title="Available Sensors"
                isOpen={sensorsModalOpen}
                closeEvent={() => setSensorsModalOpen(false)}
                multipleSelections={false}
                itemsType="sensors"
                childrenArray={availableSensors}
                selection={selectedSensor}
                onSelect={handleSensorSelect}
                onUnselect={handleSensorUnselect}
            />
        </>
    );
};

export default SensorSelector;
