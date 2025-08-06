// * React and Redux:
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPoint } from '../features/formFeatures/GeometrySlice';

// * Components:
import { Modal } from './index.js';

// * Utils:
import { drawCarthesianPlane } from '../utils';
import { useCarthesianPlaneControls } from '../hooks/useCarthesianPlaneControls';


const CarthesianPlane = ({ active = true }) => {

    const dispatch = useDispatch();
    const drawingMode = useSelector((state) => state.drawingMode.on);
    const points = useSelector((state) => state.geometry.points);

    const [modalOpen, setModalOpen] = useState(false);

    const canvasRef = useRef(null);
    const zoomRef = useRef(1);
    const centerRef = useRef({ x: 0, y: 0 });

    const handleCanvasClick = (event) => {
        if (!drawingMode) return;
        
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Convert canvas coordinates to world coordinates
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        const visibleRangeX = 2000 / zoomRef.current;
        const visibleRangeY = 2000 / zoomRef.current;
        
        const worldX = centerRef.current.x + (x - width / 2) * (visibleRangeX / width);
        const worldY = centerRef.current.y - (y - height / 2) * (visibleRangeY / height);
        
        const point = { x: Math.round(worldX * 100) / 100, y: Math.round(worldY * 100) / 100 };
        
        dispatch(addPoint(point));
    };

    useCarthesianPlaneControls(canvasRef, zoomRef, centerRef, points, drawingMode, handleCanvasClick, active);

    return (
        <div className="flex flex-col space-y-1 w-full h-full">
            <canvas
                className={`carthesian-plane w-full h-full touch-none ${drawingMode ? 'cursor-crosshair' : 'cursor-grab'}`}
                ref={canvasRef}
            >
                
            </canvas>
        </div>
    );
};

export default CarthesianPlane;
