import React, { useRef, useEffect } from 'react';
import { drawCarthesianPlane } from '../utils';

const CarthesianPlane = ({ active = true }) => {
    const canvasRef = useRef(null);
    const zoomRef = useRef(1);
    const centerRef = useRef({ x: 0, y: 0 });

    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const centerStart = useRef({ x: 0, y: 0 });

    const render = () => {
        const canvas = canvasRef.current;
        if (canvas && canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
            drawCarthesianPlane(canvas, zoomRef.current, centerRef.current.x, centerRef.current.y);
        }
    };

    useEffect(() => {
        if (active) {
            setTimeout(() => {
                render();
            }, 50);
        }
    }, [active]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleWheel = (event) => {
            event.preventDefault();
            const zoomIntensity = 0.1;
            const direction = Math.sign(event.deltaY);
            const factor = 1 - direction * zoomIntensity;
            zoomRef.current *= factor;
            render();
        };

        const handleMouseDown = (event) => {
            isDragging.current = true;
            dragStart.current = { x: event.clientX, y: event.clientY };
            centerStart.current = { ...centerRef.current };
        };

        const handleMouseMove = (event) => {
            if (!isDragging.current) return;

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

        const handleMouseUp = () => {
            isDragging.current = false;
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
            if (!isDragging.current || event.touches.length !== 1) return;

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

        const handleTouchEnd = () => {
            isDragging.current = false;
        };

        const handleResize = () => {
            render();
        };

        canvas.addEventListener('wheel', handleWheel, { passive: false });
        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('resize', handleResize);

        render();

        return () => {
            canvas.removeEventListener('wheel', handleWheel);
            canvas.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="flex flex-col w-full h-full">
            <canvas
                className="carthesian-plane w-full h-full touch-none cursor-grab"
                ref={canvasRef}
            />
        </div>
    );
};

export default CarthesianPlane;
