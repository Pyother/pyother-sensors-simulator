// * React and Redux:
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCalc } from '../features/CalcsSlice';
import { setAvailableSensors } from '../features/ConfigSlice';
import { setMaterials } from '../features/MaterialsSlice';

// * Components:
import Modal from './Modal';

// * Actions: 
import { verifyData, sendRequest, getConfig, getMaterials } from '../actions';

const Form = () => {

    const dispatch = useDispatch();
    const availableSensors = useSelector((state) => state.config.availableSensors);

    const [sensorsModalOpen, setSensorsModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);

    // * → Form data:
    const [positionX, setPositionX] = useState(0);
    const [positionY, setPositionY] = useState(0);
    const [direction, setDirection] = useState(0);
    const [angleStep, setAngleStep] = useState(1);
    const [sensorsArray, setSensorsArray] = useState([]);

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
                className="mt-0.5 mb-0"
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
                Calculate
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
        </>
    )
}

export default Form;