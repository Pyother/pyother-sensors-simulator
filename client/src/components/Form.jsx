// * React:
import React, { useState } from 'react';

const Form = () => {
    return (
        <>
            <div className="flex flex-row space-x-1">
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
            />
            <button>
                Calculate
            </button>
        </>
    )
}

export default Form;