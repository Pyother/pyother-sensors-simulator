// * React and Redux:
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCalc } from '../features/CalcsSlice';
import { setAvailableSensors } from '../features/ConfigSlice';
import { setMaterials } from '../features/MaterialsSlice';
import { toggleDrawingMode } from '../features/DrawingModeSlice';
import { addObject } from '../features/formFeatures/ObjectsSlice';
import { removeLastPoint, clearPoints } from '../features/formFeatures/GeometrySlice';

// * UI:
import { 
    IoCalculatorOutline, 
    IoAddOutline, 
    IoCheckmark,
    IoArrowUndoOutline 
} from "react-icons/io5";

// * Components:
import Modal from './Modal';

// * Actions: 
import { verifyData, sendRequest, getConfig, getMaterials } from '../actions';

// * Utils:
import { v4 as uuidv4 } from 'uuid';


const Form = () => {

    const dispatch = useDispatch();

    // * → Redux state selectors:
    const availableSensors = useSelector((state) => state.config.availableSensors);
    const drawingModeOn = useSelector((state) => state.drawingMode.on);
    const materials = useSelector((state) => state.materials.materials);
    const objects = useSelector((state) => state.objects.selectedObjects);
    const geometry = useSelector((state) => state.geometry.points);

    // * → Modals controllers:
    const [sensorsModalOpen, setSensorsModalOpen] = useState(false);
    const [materialsModalOpen, setMaterialsModalOpen] = useState(false);
    const [objectsModalOpen, setObjectsModalOpen] = useState(false);
    const [objectNameModalOpen, setObjectNameModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);

    // * → Form data:
    const [positionX, setPositionX] = useState(0);
    const [positionY, setPositionY] = useState(0);
    const [direction, setDirection] = useState(0);
    const [angleStep, setAngleStep] = useState(1);
    const [sensorsArray, setSensorsArray] = useState([]);
    const [objectsArray, setObjectsArray] = useState([]);

    // * → Objects creation:
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [objectName, setObjectName] = useState('');
    const [objectColor, setObjectColor] = useState('#0066cc');

    // * → Errors:
    const [error, setError] = useState(null);

    const handleError = (error) => {
        setError(error);
        setTimeout(() => {
            setError(null);
        }, 5000);
    }

    useEffect(() => {
        // * → Fetching config and materials:
        const fetchData = async () => {
            await getConfig({ 
                setData: (data) => { dispatch(setAvailableSensors(data.availableSensors)) },
                setError: (err) => {
                    setError(err);
                    setErrorModalOpen(true);
                }
            });
            await getMaterials({
                setData: (data) => { dispatch(setMaterials(data.surfacesParams)) },
                setError: (err) => {
                    setError(err);
                    setErrorModalOpen(true);
                }
            });
        }

        fetchData();

    }, []);

    return (
        <>
            {/* POSITION */}
            <div className="flex flex-row space-x-1 justify-center">
                <div className="flex flex-col space-y-0.5">
                    <p className="text-sm">Position x</p>
                    <input
                        className="max-w-[7.5em]" 
                        type="number"
                        placeholder="X"
                        value={positionX}
                        onChange={(e) => setPositionX(e.target.value)}
                    />  
                </div>
                <div className="flex flex-col space-y-0.5">
                    <p className="text-sm">Position y</p>
                    <input 
                        className="max-w-[7.5em]" 
                        type="number"
                        placeholder="Y"
                        value={positionY}
                        onChange={(e) => setPositionY(e.target.value)}
                    />
                </div>
            </div>

            {/* DIRECTION */}
            <p className="text-sm">Direction</p>
            <input
                type="number"
                placeholder="Direction (degrees)"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
            />

            {/* ANGLE STEP */}
            <p className="text-sm">Angle step</p>
            <input
                type="number"
                placeholder="Angle step (degrees)"
                value={angleStep}
                onChange={(e) => setAngleStep(e.target.value)}
            />

            {/* SENSORS */}
            <p className="text-sm">Sensors</p>
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

            {/* OBJECTS */}
            <p className="text-sm">Objects</p>
            <div className="flex flex-row space-x-1">
                <button
                    onClick={() => {
                        if(!drawingModeOn) {
                            dispatch(toggleDrawingMode());
                        } else {
                            setMaterialsModalOpen(true);
                        }
                    }}
                >
                    { drawingModeOn ? <IoCheckmark className="text-2xl" /> : <IoAddOutline className="text-2xl" /> }
                </button>
                {
                    drawingModeOn ?
                    <button
                        onClick={() => {dispatch(removeLastPoint())}}
                    >
                        <IoArrowUndoOutline className="text-2xl" />
                    </button>
                    : null
                }
                <input
                    className="w-full"
                    type="text"
                    placeholder="Object"
                    value={
                        objects.length > 0 
                        ? objects.map(obj => obj.name || 'Unnamed').join(', ').length > 30
                            ? objects.map(obj => obj.name || 'Unnamed').join(', ').substring(0, 27) + '...'
                            : objects.map(obj => obj.name || 'Unnamed').join(', ')
                        : ''
                    }
                    onChange={() => {}}
                    onClick={() => setObjectsModalOpen(true)}
                />
            </div>

            {/* Error: */}
            {
                error && !errorModalOpen ? 
                    <p className="text-red-500 text-sm">
                        {error}
                    </p>
                : null
            }

            {/* SENDING REQUEST */}
            <button
                className="mt-0.5 mb-0 bg-accent"
                onClick={async () => {

                    // * → Creating data:
                    if (sensorsArray.length === 0) {
                        handleError('No sensors selected');
                        return;
                    }
                    
                    const datapack = sensorsArray.map((s) => ({
                        position: {
                            x: parseFloat(positionX),
                            y: parseFloat(positionY)
                        },
                        direction: parseFloat(direction),
                        angleStep: parseFloat(angleStep),
                        sensor: s.id,
                        inputObject: {
                            
                        }
                    }));

                    // * → Data verification:
                    datapack.forEach((data) => {
                        const result = verifyData(data);
                        if (result?.error) {
                            handleError(result.errorMessage);
                            return;
                        }
                    });

                    console.log('Datapack:', datapack);

                    // * → Sending request:
                    datapack.forEach(async (dataItem) => {
                        const result = await sendRequest({ 
                            data: dataItem,
                            setResponse: (response) => {
                                dispatch(addCalc(response));
                            }, 
                            setError: (err) => {
                                setError(err);
                                setErrorModalOpen(true);
                            }
                        });
                    });
                }}
            >
                <div className="flex flex-row items-center justify-center space-x-0.5">
                    <IoCalculatorOutline className="text-xl" />
                    <p>Calculate</p>
                </div>
            </button>

            {/* Sensor's modal */}
            <Modal 
                title="Available Sensors"
                isOpen={sensorsModalOpen}
                closeEvent={() => setSensorsModalOpen(false)}
                multipleSelections={true}
                itemsType="sensors"
                childrenArray={availableSensors}
                selectionsArray={sensorsArray}
                onSelect={(id, name) => {
                    setSensorsArray(prev => {
                        if (prev.some(s => s.id === id)) {
                            return prev; 
                        }
                        return [...prev, { id, name }];
                    });
                }}
                onUnselect={(id) => {
                    setSensorsArray(prev => prev.filter(s => s.id !== id));
                }}
            />

            {/* Error's modal */}
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

            {/* Materials modal */}
            <Modal
                title="Select material"
                isOpen={materialsModalOpen} 
                closeEvent={() => {
                    setMaterialsModalOpen(false);
                    if (selectedMaterial) {
                        // Open name/color modal instead of immediately creating object
                        setObjectNameModalOpen(true);
                    }
                }}
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
                closeEvent={() => {
                    setObjectNameModalOpen(false);
                    if (selectedMaterial && objectName.trim()) {
                        // Debug log
                        console.log('Creating object with:', {
                            name: objectName.trim(),
                            color: objectColor,
                            material: selectedMaterial?.id,
                            geometry: geometry
                        });
                        
                        // Create the object with name and color
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
                        // Reset if no name provided
                        setSelectedMaterial(null);
                        setObjectName('');
                        setObjectColor('#0066cc');
                    }
                }}
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
    )
}

export default Form;