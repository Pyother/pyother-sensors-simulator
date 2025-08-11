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
    const confirmedObjects = useSelector((state) => state.objects.selectedObjects);
    const sensorPosition = useSelector((state) => state.sensorPosition);
    const calcs = useSelector((state) => state.calcs.calcs);

    const [modalOpen, setModalOpen] = useState(false);
    const [hoveredPointIndex, setHoveredPointIndex] = useState(-1);

    const canvasRef = useRef(null);
    const zoomRef = useRef(1);
    const centerRef = useRef({ x: 0, y: 0 });

    const getPointAtPosition = (mouseX, mouseY) => {
        if (!drawingMode || points.length === 0) return -1;
        
        const canvas = canvasRef.current;
        if (!canvas) return -1;
        
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        const visibleRangeX = 2000 / zoomRef.current;
        const visibleRangeY = 2000 / zoomRef.current;
        const scaleX = width / visibleRangeX;
        const scaleY = height / visibleRangeY;
        
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const canvasX = (point.x - centerRef.current.x) * scaleX + width / 2;
            const canvasY = height / 2 - (point.y - centerRef.current.y) * scaleY;
            
            const distance = Math.sqrt(Math.pow(mouseX - canvasX, 2) + Math.pow(mouseY - canvasY, 2));
            if (distance <= 10) {
                return i;
            }
        }
        return -1;
    };

    const handleMouseMove = (event) => {
        if (!drawingMode) return;
        
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        const pointIndex = getPointAtPosition(mouseX, mouseY);
        setHoveredPointIndex(pointIndex);
    };

    const handleCanvasClick = (event) => {
        if (!drawingMode) return;
        
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const pointIndex = getPointAtPosition(x, y);
        if (pointIndex !== -1) {
            const existingPoint = points[pointIndex];
            const point = { x: existingPoint.x, y: existingPoint.y };
            dispatch(addPoint(point));
            return;
        }
        
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        const visibleRangeX = 2000 / zoomRef.current;
        const visibleRangeY = 2000 / zoomRef.current;
        
        const worldX = centerRef.current.x + (x - width / 2) * (visibleRangeX / width);
        const worldY = centerRef.current.y - (y - height / 2) * (visibleRangeY / height);
        
        const point = { x: Math.round(worldX * 100) / 100, y: Math.round(worldY * 100) / 100 };
        
        dispatch(addPoint(point));
    };

    useCarthesianPlaneControls(canvasRef, zoomRef, centerRef, points, drawingMode, handleCanvasClick, active, hoveredPointIndex, handleMouseMove, confirmedObjects, sensorPosition, calcs);

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
