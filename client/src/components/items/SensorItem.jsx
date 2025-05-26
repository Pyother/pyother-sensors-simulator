// * React: 
import React, { useState } from 'react';

// * UI:
import { IoClose, IoAddSharp, IoOpenOutline, IoRemoveOutline } from "react-icons/io5";

const SensorItem = ({ id, name, type, link, onSelect, onUnselect }) => {

    const [isSelected, setIsSelected] = useState(false);

    return (
        <div className="item w-full flex flex-row space-x-1">
            <div className="flex flex-col space-y-0.25">
                <p>{name}</p>
                <p className="text-sm text-secondary">
                    <strong>Type: </strong>{type}
                </p>
                <p className="text-sm text-secondary">
                    <strong>Documentation: </strong><a href={link}>{link}</a>
                </p>
            </div>
            <div className="flex justify-end w-full">
                <button 
                    className="text-2xl"
                    onClick={() => {
                        if (isSelected) {
                            onUnselect(id);
                        } else {
                            onSelect(id, name);
                        }
                        setIsSelected(!isSelected);
                    }}           
                >
                    {isSelected ? <IoRemoveOutline /> : <IoAddSharp />}
                </button>
            </div>
        </div>
    )
}

export default SensorItem;