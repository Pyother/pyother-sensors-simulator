import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSensorX, setSensorY } from '../../features/FormSlice';
import FormSection from './FormSection';

const PositionInputs = () => {
    const dispatch = useDispatch();
    const positionX = useSelector((state) => state.form.sensorPosition.x);
    const positionY = useSelector((state) => state.form.sensorPosition.y);

    return (
        <FormSection title="Position">
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
        </FormSection>
    );
};

export default PositionInputs;
