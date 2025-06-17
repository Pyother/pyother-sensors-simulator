import React from 'react';

// * UI:
import { IoAddSharp, IoCheckmark } from "react-icons/io5";

const MaterialItem = ({ item, selection, onSelect, onUnselect }) => {
    return (
        <div className="item flex flex-row">
            <div className="flex flex-col w-full justify-center">
                <p>{item.name}</p>
            </div>
            <div className="flex justify-end w-fit">
                <button
                    onClick={() => {
                        if (selection?.id === item.id) {
                            onUnselect(item.id);
                        } else {
                            onSelect(item.id, item.name);
                        }
                    }}
                >
                    { selection?.id === item.id ? <IoCheckmark className="text-green-500" /> : <IoAddSharp /> }
                </button>
            </div>
        </div>
    )
}

export default MaterialItem;