// * React: 
import React, { useState } from 'react';

// * UI:
import { IoClose, IoAddSharp, IoOpenOutline, IoRemoveOutline } from "react-icons/io5";

const SensorItem = ({ item, onSelect, onUnselect, selectedSensor }) => {

    const isSelected = selectedSensor && selectedSensor.id === item.id;

    return (
        <div className="item w-full flex flex-row space-x-1">
            <div className="flex flex-col space-y-0.25">
                <p>{item.name}</p>
                <p className="text-sm text-secondary">
                    <strong>Type: </strong>{item.sensorType}
                </p>
                <p className="text-sm text-secondary">
                    <strong>Producer: </strong>{item.producer}
                </p>
                <p className="text-sm text-secondary">
                    <strong>Documentation: </strong><a href={item.link}>{item.link}</a>
                </p>
            </div>
            <div className="flex justify-end w-full">
                <button 
                    className="text-2xl"
                    onClick={() => {
                        if (isSelected) {
                            onUnselect(item.id);
                        } else {
                            onSelect(item.id, item.name);
                        }
                    }}           
                >
                    {isSelected ? <IoRemoveOutline /> : <IoAddSharp />}
                </button>
            </div>
        </div>
    )
}

export default SensorItem;