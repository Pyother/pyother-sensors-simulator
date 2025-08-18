// * React and Redux:
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPoint } from '../features/FormSlice';

// * Components and UI:
import { Modal } from './index.js';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

// * Utils:
import { drawCarthesianPlane } from '../utils';
import { useCarthesianPlaneControls } from '../hooks/useCarthesianPlaneControls';

const CarthesianPlane = ({ active = true }) => {

    const dispatch = useDispatch();
    const drawingMode = useSelector((state) => state.drawingMode.on);
    const points = useSelector((state) => state.form.currentGeometry.points);
    const confirmedObjects = useSelector((state) => state.form.objects.selectedObjects);
    const sensorPosition = useSelector((state) => state.form.sensorPosition);
    const calcs = useSelector((state) => state.calcs.calcs);

    const [modalOpen, setModalOpen] = useState(false);
    const [legendOpen, setLegendOpen] = useState(false);
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

    // Check if we have simulation data to show legend
    const hasSimulationData = calcs && calcs.length > 0 && calcs.some(calcResult => 
        calcResult.simulation && Array.isArray(calcResult.simulation) && calcResult.simulation.length > 0
    );

    return (
        <div className="flex flex-col space-y-1 w-full h-full relative">
            <canvas
                className={`carthesian-plane w-full h-full touch-none ${drawingMode ? 'cursor-crosshair' : 'cursor-grab'}`}
                ref={canvasRef}
            >
                
            </canvas>
            
            {/* Legend HTML Overlay */}
            {hasSimulationData && (
                <div className="absolute top-1 right-1 bg-white border border-gray-400 rounded-lg p-1 min-w-[160px]">
                    <div className="flex flex-col space-y-1">
                        <div className="flex flex-row space-x-1 justify-start items-center">
                            <h3 className="text-sm font-semibold text-center">Legend</h3>
                            <div className="flex flex-row flex-1 justify-end">
                                <div onClick={() => setLegendOpen(!legendOpen)} className="text-gray-600 hover:text-gray-800">
                                    {legendOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                </div>
                            </div>
                        </div>
                        {/* Accurate point */}
                        {legendOpen && (
                            <>
                                <div className="flex items-center space-x-1">
                                    <div className="relative w-1 h-1">
                                        <div className="absolute inset-0 bg-blue-600 rounded-full border-2 border-white"></div>
                                        <div className="absolute inset-2 bg-white rounded-full"></div>
                                    </div>
                                    <span className="text-xs text-gray-700">Accurate Point (A)</span>
                                </div>
                                
                                {/* Range point */}
                                <div className="flex items-center space-x-1">
                                    <div className="relative w-1 h-1">
                                        <div className="absolute inset-0 bg-green-500 rounded-full border border-white"></div>
                                        <div className="absolute inset-1 flex items-center justify-center">
                                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 12 12">
                                                <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-700">Range Point (R)</span>
                                </div>
                                
                                {/* Global simulated point */}
                                <div className="flex items-center space-x-1">
                                    <div className="relative w-1 h-1">
                                        <div className="absolute inset-0 bg-yellow-400 rounded-full border-2 border-black"></div>
                                        <div className="absolute inset-1 flex items-center justify-center">
                                            <svg className="w-1 h-1 text-black" fill="none" stroke="currentColor" viewBox="0 0 12 12" strokeWidth="2">
                                                <path d="M6 1v10M1 6h10"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-700">Global Simulation (G)</span>
                                </div>
                                <h4 className="text-xs font-bold text-center mb-1 text-gray-800">Simulation Likelihood</h4>
                                <div className="relative h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded mb-1"></div>
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>0%</span>
                                    <span>50%</span>
                                    <span>100%</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarthesianPlane;
