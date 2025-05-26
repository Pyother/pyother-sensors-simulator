// * React:
import React, { useState } from 'react';

// * Components:
import Modal from './Modal';

const Form = () => {

    const [modalOpen, setModalOpen] = useState(false);
    const [selectionsArray, setSelectionsArray] = useState([]);

    return (
        <>
            <div className="flex flex-row space-x-1 justify-center">
                <input
                    className="max-w-[7.5em]" 
                    type="number"
                    placeholder="X"
                />
                <input 
                    className="max-w-[7.5em]" 
                    type="number"
                    placeholder="Y"
                />
            </div>
            <input
                type="number"
                placeholder="Direction (degrees)"
            />
            <input
                type="number"
                placeholder="Angle step (degrees)"
            />
            <input
                type="text"
                placeholder="Sensor"
                onClick={() => setModalOpen(true)}
                value={
                    selectionsArray.length > 0 
                    ? selectionsArray.map(s => s.name).join(', ') 
                    : ''
                }
            />
            <button>
                Calculate
            </button>
            <Modal 
                title="Available Sensors"
                isOpen={modalOpen}
                closeEvent={() => setModalOpen(false)}
                childrenArray={[
                    { id: 1, name: 'Grove - Ultrasonic Ranger', chip: 'ultrasonic', link: 'https://botland.com.pl/ultradzwiekowe-czujniki-odleglosci/1420-ultradzwiekowy-czujnik-odleglosci-hc-sr04-2-200cm-justpi-5903351241366.html' },
                    { id: 2, name: 'Sensor 2', chip: 'optical', link: 'https://example.com/sensor2' },
                    { id: 3, name: 'Sensor 3', chip: 'ultrasonic', link: 'https://example.com/sensor3' },
                    { id: 4, name: 'Sensor 1', chip: 'ultrasonic', link: 'https://example.com/sensor1' },
                    { id: 5, name: 'Sensor 2', chip: 'optical', link: 'https://example.com/sensor2' },
                    { id: 6, name: 'Sensor 3', chip: 'ultrasonic', link: 'https://example.com/sensor3' },
                    { id: 7, name: 'Sensor 1', chip: 'ultrasonic', link: 'https://example.com/sensor1' },
                    { id: 8, name: 'Sensor 2', chip: 'optical', link: 'https://example.com/sensor2' },
                    { id: 9, name: 'Sensor 3', chip: 'ultrasonic', link: 'https://example.com/sensor3' }
                ]}
                selectionsArray={selectionsArray}
                onSelect={(id, name) => {
                    setSelectionsArray(prev => [...prev, { id, name }]);
                }}
                onUnselect={(id) => {
                    setSelectionsArray(prev => prev.filter(item => item.id !== id));
                }}
            />
        </>
    )
}

export default Form;