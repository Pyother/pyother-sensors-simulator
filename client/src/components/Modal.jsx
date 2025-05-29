// * React:
import React, { useState } from 'react';

// * UI:
import { IoClose, IoAddSharp, IoOpenOutline, IoAlertOutline } from "react-icons/io5";
import SensorItem from './items/SensorItem';

const Modal = ({ 
    title, 
    isOpen, 
    closeEvent,
    multipleSelections,
    itemsType, 
    childrenArray, 
    message,
    selection,
    selectionsArray,
    onSelect, 
    onUnselect
}) => {

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'hidden'} p-1`}>
            <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            <div className="relative bg-white rounded p-1 w-full max-w-md max-h-[80vh] flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center space-x-0.5">
                        {itemsType === 'error' ? <IoAlertOutline className="text-red-500" /> : null}
                        {title}
                    </h2>
                    <button onClick={closeEvent} className="text-2xl">
                        <IoClose />
                    </button>
                </div>
                <div className="flex flex-col overflow-y-auto space-y-1">
                    {itemsType === 'sensors' && childrenArray.map(item => (
                        <SensorItem 
                            key={item.id} 
                            item={item} 
                            onSelect={onSelect} 
                            onUnselect={onUnselect} 
                        />
                    ))}
                    {itemsType === 'message' || itemsType === 'error' && <p>{message}</p>}
                </div>
                {
                    itemsType !== 'message' && itemsType !== 'error' ? 
                    <p>
                        {
                            selection || selectionsArray.length > 0 ?
                            <><strong>Selected: </strong> {
                                multipleSelections ? selectionsArray.map(s => s.name).join(', ')
                                : selection.name
                            } </> : null
                        }
                    </p> : null
                }
                <div className="flex justify-end">
                    <button onClick={closeEvent}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );    
};

export default Modal;
