import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDrawingMode } from '../../features/DrawingModeSlice';
import { addObject } from '../../features/FormSlice';
import { removeLastPoint, clearPoints } from '../../features/FormSlice';
import { 
    IoAddOutline,
    IoCheckmark,
    IoArrowUndoOutline 
} from "react-icons/io5";
import { v4 as uuidv4 } from 'uuid';
import FormSection from './FormSection';
import ValidationMessage from './ValidationMessage';
import Modal from '../Modal';

const ObjectCreator = ({ materials, showValidationMessages }) => {
    const dispatch = useDispatch();
    
    // Redux selectors
    const drawingModeOn = useSelector((state) => state.drawingMode.on);
    const objects = useSelector((state) => state.form.objects.selectedObjects);
    const geometry = useSelector((state) => state.form.currentGeometry.points);

    // Local state for modals and object creation
    const [materialsModalOpen, setMaterialsModalOpen] = useState(false);
    const [objectsModalOpen, setObjectsModalOpen] = useState(false);
    const [objectNameModalOpen, setObjectNameModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [objectName, setObjectName] = useState('');
    const [objectColor, setObjectColor] = useState('#0066cc');

    const handleAddObjectClick = () => {
        if(!drawingModeOn) {
            dispatch(toggleDrawingMode());
        } else {
            setMaterialsModalOpen(true);
        }
    };

    const handleMaterialsModalClose = () => {
        setMaterialsModalOpen(false);
        if (selectedMaterial) {
            setObjectNameModalOpen(true);
        }
    };

    const handleObjectDetailsModalClose = () => {
        setObjectNameModalOpen(false);
        if (selectedMaterial && objectName.trim()) {
            /*console.log('Creating object with:', {
                name: objectName.trim(),
                color: objectColor,
                material: selectedMaterial?.id,
                geometry: geometry
            });*/
            
            dispatch(toggleDrawingMode());
            dispatch(addObject({
                id: uuidv4() || null,
                name: objectName.trim(),
                color: objectColor,
                geometry: geometry,
                material: selectedMaterial?.id || null
            }));
            dispatch(clearPoints());
            setSelectedMaterial(null);
            setObjectName('');
            setObjectColor('#0066cc');
        } else {
            console.log('Object creation cancelled. ObjectName:', objectName, 'SelectedMaterial:', selectedMaterial);
            setSelectedMaterial(null);
            setObjectName('');
            setObjectColor('#0066cc');
        }
    };

    const displayValue = objects.length > 0 
        ? objects.map(obj => obj.name || 'Unnamed').join(', ').length > 30
            ? objects.map(obj => obj.name || 'Unnamed').join(', ').substring(0, 27) + '...'
            : objects.map(obj => obj.name || 'Unnamed').join(', ')
        : '';

    return (
        <>
            <FormSection title="Objects">
                <ValidationMessage
                    show={showValidationMessages && objects.length === 0}
                    isValid={false}
                    errorMessage="Create at least one object."
                />
                <ValidationMessage
                    show={showValidationMessages && objects.length > 0}
                    isValid={true}
                    validMessage="Objects created."
                />
                <div className="flex flex-row space-x-1">
                    <button onClick={handleAddObjectClick}>
                        { drawingModeOn ? <IoCheckmark className="text-2xl" /> : <IoAddOutline className="text-2xl" /> }
                    </button>
                    {
                        drawingModeOn ?
                        <button onClick={() => {dispatch(removeLastPoint())}}>
                            <IoArrowUndoOutline className="text-2xl" />
                        </button>
                        : null
                    }
                    <input
                        className="w-full"
                        type="text"
                        placeholder="Object"
                        value={displayValue}
                        onChange={() => {}}
                        onClick={() => setObjectsModalOpen(true)}
                    />
                </div>
            </FormSection>

            {/* Materials modal */}
            <Modal
                title="Select material"
                isOpen={materialsModalOpen} 
                closeEvent={handleMaterialsModalClose}
                multipleSelections={false}
                itemsType="materials"
                childrenArray={materials}
                onSelect={(id, name) => {
                    setSelectedMaterial({ id, name });
                }}
                onUnselect={() => {
                    setSelectedMaterial(null);
                }}
                selection={selectedMaterial}
                confirmLocked={selectedMaterial === null}
            />

            {/* Object Name and Color modal */}
            <Modal
                title="Object Details"
                isOpen={objectNameModalOpen}
                closeEvent={handleObjectDetailsModalClose}
                multipleSelections={false}
                itemsType="objectDetails"
                objectName={objectName}
                objectColor={objectColor}
                onNameChange={setObjectName}
                onColorChange={setObjectColor}
                confirmLocked={!objectName.trim()}
            />

            {/* Objects modal */}
            <Modal
                title="Objects"
                isOpen={objectsModalOpen}
                closeEvent={() => {
                    setObjectsModalOpen(false);
                }}
                multipleSelections={false}
                itemsType="objectsList"
                childrenArray={objects}
            />
        </>
    );
};

export default ObjectCreator;
