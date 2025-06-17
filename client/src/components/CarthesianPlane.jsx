// * React and Redux:
import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDrawingMode } from '../features/DrawingModeSlice';

// * Components:
import { Modal } from './index.js';

// * Utils:
import { drawCarthesianPlane } from '../utils';
import { useCarthesianPlaneControls } from '../hooks/useCarthesianPlaneControls';


const CarthesianPlane = ({ active = true }) => {

    const dispatch = useDispatch();
    const drawingMode = useSelector((state) => state.drawingMode.on);

    const [modalOpen, setModalOpen] = useState(false);

    const canvasRef = useRef(null);
    const zoomRef = useRef(1);
    const centerRef = useRef({ x: 0, y: 0 });

    const render = () => {
        const canvas = canvasRef.current;
        if (canvas && canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
            drawCarthesianPlane(canvas, zoomRef.current, centerRef.current.x, centerRef.current.y);
        }
    };

    useCarthesianPlaneControls(canvasRef, zoomRef, centerRef, render);

    useEffect(() => {
        if (active) {
            setTimeout(() => {
                render();
            }, 50);
        }
    }, [active]);

    return (
        <div className="flex flex-col space-y-1 w-full h-full">
            <canvas
                className="carthesian-plane w-full h-full touch-none cursor-grab"
                ref={canvasRef}
            >
                
            </canvas>
        </div>
    );
};

export default CarthesianPlane;
