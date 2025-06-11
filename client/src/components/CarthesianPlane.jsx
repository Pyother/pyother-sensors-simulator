import React, { useRef, useEffect } from 'react';

// * → drawCarthesianPlane
/** 
 * @param canvas {HTMLCanvasElement}
**/
const drawCarthesianPlane = (canvas) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 0.5;
    ctx.stroke();
}

const CarthesianPlane = () => {

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            drawCarthesianPlane(canvas);
        }
    })

    return (
        <div className="flex flex-col space-y-0.5 w-full h-full">
            <canvas  
                className="carthesian-plane"
                ref={canvasRef}
            >
                
            </canvas>
        </div>
    );
};

export default CarthesianPlane;
