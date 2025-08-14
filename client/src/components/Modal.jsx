// * React:
import React, { useState } from 'react';

// * UI:
import { IoClose, IoAddSharp, IoOpenOutline, IoAlertOutline } from "react-icons/io5";
import {
    SensorItem,
    MaterialItem
} from './items'; 

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
    onUnselect,
    confirmLocked,
    objectName,
    objectColor,
    onNameChange,
    onColorChange
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
                    {itemsType === 'materials' || itemsType === 'objectDetails' ? null : 
                        <button onClick={closeEvent} className="text-2xl">
                            <IoClose />
                        </button>
                    }
                </div>
                <div className="flex flex-col overflow-y-auto space-y-1">
                    {itemsType === 'sensors' && childrenArray.map(item => (
                        <SensorItem 
                            key={item.id} 
                            item={item} 
                            onSelect={onSelect} 
                            onUnselect={onUnselect}
                            selectedSensor={selection}
                        />
                    ))}
                    {itemsType === 'materials' && childrenArray.map(item => (
                        <MaterialItem 
                            key={item.id} 
                            item={item} 
                            selection={selection}
                            onSelect={onSelect}
                            onUnselect={onUnselect}
                        />
                    ))}
                    {itemsType === 'objectDetails' && (
                        <div className="flex flex-col space-y-1">
                            <div className="flex flex-col space-y-0.5">
                                <p className="text-sm font-semibold">Object Name</p>
                                <input
                                    type="text"
                                    placeholder="Enter object name"
                                    value={objectName || ''}
                                    onChange={(e) => onNameChange && onNameChange(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex flex-col space-y-0.5">
                                <p className="text-sm font-semibold">Object Color</p>
                                <div className="flex flex-row space-x-1 items-center">
                                    <input
                                        type="color"
                                        value={objectColor || '#0066cc'}
                                        onChange={(e) => onColorChange && onColorChange(e.target.value)}
                                        className="w-12 h-8"
                                    />
                                    <input
                                        type="text"
                                        value={objectColor || '#0066cc'}
                                        onChange={(e) => onColorChange && onColorChange(e.target.value)}
                                        className="flex-1"
                                        placeholder="#0066cc"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {itemsType === 'objectsList' && childrenArray && childrenArray.length > 0 && (
                        <div className="flex flex-col space-y-1">
                            {childrenArray.map((obj, index) => (
                                <div key={obj.id || index} className="item flex flex-row items-center space-x-2">
                                    <div 
                                        className="w-4 h-4 rounded-full border" 
                                        style={{ backgroundColor: obj.color || '#0066cc' }}
                                    ></div>
                                    <div className="flex flex-col flex-1">
                                        <p className="font-semibold">{obj.name || 'Unnamed Object'}</p>
                                        <p className="text-sm text-secondary">
                                            Material ID: {obj.material || 'Unknown'}
                                        </p>
                                        <p className="text-sm text-secondary">
                                            Points: {obj.geometry ? obj.geometry.length : 0}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {itemsType === 'objectsList' && (!childrenArray || childrenArray.length === 0) && (
                        <p className="text-center text-secondary">No objects created yet.</p>
                    )}
                    {(itemsType === 'message' || itemsType === 'error') && <p>{message}</p>}
                </div>
                {
                    itemsType !== 'message' && itemsType !== 'error' && itemsType !== 'objectsList' && itemsType !== 'objectDetails' ? 
                    <p>
                        {
                            selection || selectionsArray?.length > 0 ?
                            <><strong>Selected: </strong> {
                                multipleSelections ? selectionsArray.map(s => s.name).join(', ')
                                : selection.name
                            } </> : null
                        }
                    </p> : null
                }
                <div className="flex justify-end">
                    <button 
                        onClick={closeEvent}
                        disabled={confirmLocked}
                        className={confirmLocked ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        { 
                            itemsType === 'materials' ? 'Confirm' : 
                            itemsType === 'objectDetails' ? 'Create Object' :
                            'Close' 
                        }
                    </button>
                </div>
            </div>
        </div>
    );    
};

export default Modal;
