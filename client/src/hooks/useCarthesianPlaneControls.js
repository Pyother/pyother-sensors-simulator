import { useEffect, useRef } from 'react';
import { drawCarthesianPlane } from '../utils';

export const useCarthesianPlaneControls = (canvasRef, zoomRef, centerRef, points, drawingMode = false, handleCanvasClick = null, active = true, hoveredPointIndex = -1, onMouseMove = null) => {
    
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const centerStart = useRef({ x: 0, y: 0 });

    useEffect(() => {
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        const render = () => {
            if (canvas && canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
                drawCarthesianPlane(canvas, zoomRef.current, centerRef.current.x, centerRef.current.y, points, hoveredPointIndex);
            }
        };

        render();

        if (active) {
            setTimeout(() => {
                render();
            }, 50);
        }

        const handleWheel = (event) => {
            event.preventDefault();
            const zoomIntensity = 0.1;
            const direction = Math.sign(event.deltaY);
            const factor = 1 - direction * zoomIntensity;
            zoomRef.current *= factor;
            render();
        };

        const handleMouseDown = (event) => {
            if (!drawingMode) {
                isDragging.current = true;
                dragStart.current = { x: event.clientX, y: event.clientY };
                centerStart.current = { ...centerRef.current };
            }
        };

        const handleMouseMove = (event) => {
            if (drawingMode && onMouseMove) {
                // Handle hover detection in drawing mode
                onMouseMove(event);
                return;
            }
            
            if (!isDragging.current || drawingMode) return;

            const dx = event.clientX - dragStart.current.x;
            const dy = event.clientY - dragStart.current.y;
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;
            const rangeX = 2000 / zoomRef.current;
            const rangeY = 2000 / zoomRef.current;
            const scaleX = rangeX / width;
            const scaleY = rangeY / height;

            centerRef.current.x = centerStart.current.x - dx * scaleX;
            centerRef.current.y = centerStart.current.y + dy * scaleY;

            render();
        };

        const handleMouseUp = (event) => {
            isDragging.current = false;
        };

        const handleClick = (event) => {
            if (drawingMode && handleCanvasClick) {
                handleCanvasClick(event);
            }
        };

        const handleTouchStart = (event) => {
            if (event.touches.length === 1) {
                isDragging.current = true;
                dragStart.current = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY
                };
                centerStart.current = { ...centerRef.current };
            }
        };

        const handleTouchMove = (event) => {
            if (!isDragging.current || event.touches.length !== 1 || drawingMode) return;

            const dx = event.touches[0].clientX - dragStart.current.x;
            const dy = event.touches[0].clientY - dragStart.current.y;
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;
            const rangeX = 2000 / zoomRef.current;
            const rangeY = 2000 / zoomRef.current;
            const scaleX = rangeX / width;
            const scaleY = rangeY / height;

            centerRef.current.x = centerStart.current.x - dx * scaleX;
            centerRef.current.y = centerStart.current.y + dy * scaleY;

            event.preventDefault();
            render();
        };

        const handleTouchEnd = (event) => {
            if (drawingMode && handleCanvasClick && event.changedTouches.length === 1) {
                // For touch devices, simulate a click event
                const touch = event.changedTouches[0];
                const rect = canvas.getBoundingClientRect();
                const simulatedEvent = {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                };
                handleCanvasClick(simulatedEvent);
            }
            isDragging.current = false;
        };

        const handleResize = () => {
            render();
        };

        canvas.addEventListener('wheel', handleWheel, { passive: false });
        if (!drawingMode) {
            canvas.addEventListener('mousedown', handleMouseDown);
            window.addEventListener('mousemove', handleMouseMove);
            canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
        } else {
            canvas.addEventListener('click', handleClick);
            canvas.addEventListener('touchend', handleTouchEnd);
            window.addEventListener('mousemove', handleMouseMove); // Add mousemove for hover detection
        }
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('resize', handleResize);

        return () => {
            canvas.removeEventListener('wheel', handleWheel);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('click', handleClick);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('resize', handleResize);
        };
    }, [drawingMode, points, active, hoveredPointIndex]);
};
