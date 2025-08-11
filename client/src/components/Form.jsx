// * React and Redux:
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCalc } from '../features/CalcsSlice';
import { setAvailableSensors } from '../features/ConfigSlice';
import { setMaterials } from '../features/MaterialsSlice';
import { toggleDrawingMode } from '../features/DrawingModeSlice';
import { addObject } from '../features/formFeatures/ObjectsSlice';
import { removeLastPoint, clearPoints } from '../features/formFeatures/GeometrySlice';
import { setSensorX, setSensorY, setSensorDirection, setSensorAngleStep, setSensorFieldOfView } from '../features/SensorPositionSlice';

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
    const positionX = useSelector((state) => state.sensorPosition.x);
    const positionY = useSelector((state) => state.sensorPosition.y);
    const direction = useSelector((state) => state.sensorPosition.direction);
    const angleStep = useSelector((state) => state.sensorPosition.angleStep);

    // * → Modals controllers:
    const [sensorsModalOpen, setSensorsModalOpen] = useState(false);
    const [materialsModalOpen, setMaterialsModalOpen] = useState(false);
    const [objectsModalOpen, setObjectsModalOpen] = useState(false);
    const [objectNameModalOpen, setObjectNameModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);

    // * → Form data:
    const [sensorsArray, setSensorsArray] = useState([]);
    const [objectsArray, setObjectsArray] = useState([]);

    // * → Objects creation:
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [objectName, setObjectName] = useState('');
    const [objectColor, setObjectColor] = useState('#0066cc');

    // * → Errors:
    const [error, setError] = useState(null);
    const [showValidationMessages, setShowValidationMessages] = useState(false);

    const handleError = (error) => {
        setError(error);
        setTimeout(() => {
            setError(null);
        }, 5000);
    }

    const showValidationErrors = () => {
        setShowValidationMessages(true);
        setTimeout(() => {
            setShowValidationMessages(false);
        }, 5000);
    };

    const validateCalculateInputs = () => {
        if (sensorsArray.length === 0) {
            return { valid: false, message: 'At least one sensor must be selected' };
        }

        if (objects.length === 0) {
            return { valid: false, message: 'At least one object must be created' };
        }

        const directionValue = parseFloat(direction);
        if (isNaN(directionValue) || directionValue < -180 || directionValue > 180) {
            return { valid: false, message: 'Direction must be between -180 and 180 degrees' };
        }

        return { valid: true };
    };

    const isCalculateDisabled = () => {
        const validation = validateCalculateInputs();
        return !validation.valid;
    };

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
                        onChange={(e) => dispatch(setSensorX(parseFloat(e.target.value) || 0))}
                    />  
                </div>
                <div className="flex flex-col space-y-0.5">
                    <p className="text-sm">Position y</p>
                    <input 
                        className="max-w-[7.5em]" 
                        type="number"
                        placeholder="Y"
                        value={positionY}
                        onChange={(e) => dispatch(setSensorY(parseFloat(e.target.value) || 0))}
                    />
                </div>
            </div>

            {/* DIRECTION */}
            <p className="text-sm">Direction</p>
            <input
                type="number"
                placeholder="Direction (degrees)"
                value={direction}
                onChange={(e) => dispatch(setSensorDirection(parseFloat(e.target.value) || 0))}
                min="-180"
                max="180"
                className={
                    direction && (parseFloat(direction) < -180 || parseFloat(direction) > 180) 
                    ? 'border-red-500' 
                    : ''
                }
            />
            {showValidationMessages && direction && (parseFloat(direction) < -180 || parseFloat(direction) > 180) && (
                <p className="text-red-500 text-sm mb-1">
                    Direction must be between -180 and 180 degrees
                </p>
            )}
            {showValidationMessages && (direction !== '' && parseFloat(direction) >= -180 && parseFloat(direction) <= 180) && (
                <p className="text-green-500 text-sm mb-1">
                    ✓ Direction is valid.
                </p>
            )}

            {/* SENSORS */}
            <p className="text-sm">Sensors</p>
            {showValidationMessages && sensorsArray.length === 0 && (
                <p className="text-red-500 text-sm mb-1">
                    Select at least one sensor.
                </p>
            )}
            {showValidationMessages && (sensorsArray.length > 0) && (
                <p className="text-green-500 text-sm mb-1">
                    ✓ Sensors selected.
                </p>
            )}
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

            {/* ANGLE STEP */}
            <p className="text-sm">Angle step</p>
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

            {/* OBJECTS */}
            <p className="text-sm">Objects</p>
            {showValidationMessages && objects.length === 0 && (
                <p className="text-red-500 text-sm mb-1">
                    Create at least one object.
                </p>
            )}
            {showValidationMessages && (objects.length > 0) && (
                <p className="text-green-500 text-sm mb-1">
                    ✓ Objects created.
                </p>
            )}
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
                className={`mt-0.5 mb-0 ${isCalculateDisabled() ? 'opacity-50 cursor-not-allowed bg-gray-300' : 'bg-accent'}`}
                disabled={isCalculateDisabled()}
                onClick={async () => {

                    // * → Validation check
                    const validation = validateCalculateInputs();
                    if (!validation.valid) {
                        handleError(validation.message);
                        showValidationErrors();
                        return;
                    }

                    // * → Creating data:
                    const datapack = sensorsArray.map((s) => ({
                        position: {
                            x: parseFloat(positionX),
                            y: parseFloat(positionY)
                        },
                        direction: parseFloat(direction),
                        angleStep: parseFloat(angleStep),
                        sensor: s.id,
                        inputObjects: objects.map(obj => ({
                            id: obj.id,
                            name: obj.name,
                            material: obj.material,
                            geometry: obj.geometry
                        }))
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
                        
                        // Find the selected sensor and set its fieldOfView
                        const selectedSensor = availableSensors.find(sensor => sensor.name === name);
                        if (selectedSensor && selectedSensor.fieldOfView) {
                            dispatch(setSensorFieldOfView(selectedSensor.fieldOfView));
                        }
                        
                        return [...prev, { id, name }];
                    });
                }}
                onUnselect={(id) => {
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
                        console.log('Creating object with:', {
                            name: objectName.trim(),
                            color: objectColor,
                            material: selectedMaterial?.id,
                            geometry: geometry
                        });
                        
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