// React and Redux:
import React, { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addObject } from "../../features/data/InputObjectsSlice";

// * MUI:
import {
    Stack, 
    IconButton, 
    Typography,
    Button,
    TextField,
    InputAdornment,
    ThemeProvider
} from '@mui/material';

// * Icons:
import { HiOutlineArrowUturnLeft } from "react-icons/hi2";
import { HiOutlineArrowUturnRight } from "react-icons/hi2";
import { HiCheck } from "react-icons/hi";
import { HiOutlineX } from "react-icons/hi";

// * Styles:
import colorsTheme from "../../assets/themes/colorsTheme";

const InputObjectGenerator = () => {

    const dispatch = useDispatch();

    const canvasRef = useRef(null);
    const [points, setPoints] = useState([]);
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [redoStack, setRedoStack] = useState([]);
    const [objectName, setObjectName] = useState("");

    const draw = (ctx) => {

        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        const centerX = width / 2 + offset.x;
        const centerY = height / 2 + offset.y;

        const step = 50 * scale;

        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        ctx.fillStyle = "#aaa";
        ctx.font = "10px Arial";

        for (let x = centerX; x < width; x += step) {
            ctx.fillText(((x - centerX) / step).toFixed(1), x, centerY - 5);
        }
        for (let x = centerX; x > 0; x -= step) {
            ctx.fillText(((x - centerX) / step).toFixed(1), x, centerY - 5);
        }
        for (let y = centerY; y < height; y += step) {
            ctx.fillText(-((y - centerY) / step).toFixed(1), centerX + 5, y);
        }
        for (let y = centerY; y > 0; y -= step) {
            ctx.fillText(-((y - centerY) / step).toFixed(1), centerX + 5, y);
        }

        if (points.length > 1) {

            ctx.strokeStyle = "#003366";
            ctx.lineWidth = 2;
            ctx.beginPath();
            points.forEach((point, index) => {
                const canvasX = centerX + point.x * step;
                const canvasY = centerY - point.y * step;
                if (index === 0) {
                    ctx.moveTo(canvasX, canvasY);
                } else {
                    ctx.lineTo(canvasX, canvasY);
                }
            });
            ctx.stroke();
        }

        points.forEach((point, index) => {

            const canvasX = centerX + point.x * step;
            const canvasY = centerY - point.y * step;

            ctx.fillStyle = index === hoveredPoint ? "#ffcc00" : "#003366";
            ctx.beginPath();
            ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    };

    const handleCanvasClick = (e) => {

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const width = canvas.width;
        const height = canvas.height;

        const centerX = width / 2 + offset.x;
        const centerY = height / 2 + offset.y;
        const step = 50 * scale;

        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;

        if (hoveredPoint !== null) {
            setPoints((prevPoints) => [
                ...prevPoints,
                { ...points[hoveredPoint] },
            ]);
        } else {
            const x = ((canvasX - centerX) / step).toFixed(2);
            const y = ((centerY - canvasY) / step).toFixed(2);

            setPoints((prevPoints) => [
                ...prevPoints,
                { x: parseFloat(x), y: parseFloat(y) },
            ]);
            setRedoStack([]); 
        }
    };

    const handleMouseMove = (e) => {

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const width = canvas.width;
        const height = canvas.height;

        const centerX = width / 2 + offset.x;
        const centerY = height / 2 + offset.y;
        const step = 50 * scale;

        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;

        const nearestPoint = points.findIndex((point) => {
            const x = centerX + point.x * step;
            const y = centerY - point.y * step;
            const dx = canvasX - x;
            const dy = canvasY - y;
            return Math.sqrt(dx * dx + dy * dy) < 10;
        });

        setHoveredPoint(nearestPoint === -1 ? null : nearestPoint);
    };

    const handleMouseLeave = () => {
        setHoveredPoint(null);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setScale((prevScale) => Math.max(0.1, Math.min(prevScale * delta, 10)));
    };

    const undoLastPoint = () => {
        setPoints((prevPoints) => {
            const newPoints = [...prevPoints];
            const lastPoint = newPoints.pop();
            if (lastPoint) {
                setRedoStack((prevRedo) => [lastPoint, ...prevRedo]);
            }
            return newPoints;
        });
    };

    const redoLastPoint = () => {
        setRedoStack((prevRedo) => {
            const redoPoints = [...prevRedo];
            const restoredPoint = redoPoints.shift();
            if (restoredPoint) {
                setPoints((prevPoints) => [...prevPoints, restoredPoint]);
            }
            return redoPoints;
        });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const render = () => {
            draw(ctx);
            requestAnimationFrame(render);
        };

        render();
    }, [points, hoveredPoint, offset, scale]);

    return (
        <ThemeProvider theme={colorsTheme}>
            <Stack spacing={2} className="generator-container">
                <Typography variant="body1">Input object generator</Typography>
                <div>
                    <canvas
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        onWheel={handleWheel}
                        width={500}
                        height={400}
                        className="generator-canvas"
                    />
                </div>
                <Stack direction="row" spacing={2} className="center">
                    <IconButton 
                        variant="contained" 
                        color="secondary" 
                        onClick={undoLastPoint} 
                        disabled={points.length === 0}
                    >
                        <HiOutlineArrowUturnLeft />
                    </IconButton>
                    <IconButton 
                        variant="contained" 
                        color="secondary" 
                        onClick={redoLastPoint} 
                        disabled={redoStack.length === 0}
                    >
                        <HiOutlineArrowUturnRight />
                    </IconButton>
                    <IconButton 
                        variant="contained" 
                        color="primary" 
                        onClick={() => setPoints([])}
                        disabled={points.length === 0}
                    >
                        <HiOutlineX />
                    </IconButton>
                    <TextField
                        label="Object name"
                        placeholder="Object name"
                        fullWidth
                        value={objectName}
                        onChange={(e) => setObjectName(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            // console.log(points);
                                            setPoints([]);
                                            if(objectName.length > 0) {
                                                dispatch(addObject({ name: objectName, points: points }));
                                                setObjectName("");
                                            }
                                        }}
                                        disabled={points.length === 0 || objectName.length === 0}
                                    >
                                        <HiCheck />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
            </Stack>
        </ThemeProvider>
    );
};

export default InputObjectGenerator;
