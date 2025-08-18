function drawCarthesianPlane(canvas, zoom = 1, centerXValue = 0, centerYValue = 0, points = [], hoveredPointIndex = -1, confirmedObjects = [], sensorPosition = { x: 0, y: 0 }, calcs = []) {
    
    const dpr = window.devicePixelRatio || 1;
    const widthCSS = canvas.offsetWidth;
    const heightCSS = canvas.offsetHeight;

    canvas.width = widthCSS * dpr;
    canvas.height = heightCSS * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const width = widthCSS;
    const height = heightCSS;
    
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    
    const baseRange = 2000; 
    const visibleRangeX = baseRange / zoom;
    const visibleRangeY = baseRange / zoom;
    
    const scaleX = width / visibleRangeX;
    const scaleY = height / visibleRangeY;
    
    const minX = centerXValue - visibleRangeX / 2;
    const maxX = centerXValue + visibleRangeX / 2;
    const minY = centerYValue - visibleRangeY / 2;
    const maxY = centerYValue + visibleRangeY / 2;

    const rawSpanX = maxX - minX;
    const rawSpanY = maxY - minY;

    const roundedSpanX = Math.round(rawSpanX / 200) * 200;
    const roundedSpanY = Math.round(rawSpanY / 200) * 200;

    const spacingX = roundedSpanX / 10;
    const spacingY = roundedSpanY / 10;
    
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 0.5;
    
    let firstGridX = Math.ceil(minX / spacingX) * spacingX;
    if (firstGridX > maxX) {
        firstGridX -= spacingX;
    }
    for (let x = firstGridX; x <= maxX; x += spacingX) {
        const canvasX = (x - centerXValue) * scaleX + width / 2;
        ctx.beginPath();
        ctx.moveTo(canvasX, 0);
        ctx.lineTo(canvasX, height);
        ctx.stroke();
    }
    
    let firstGridY = Math.ceil(minY / spacingY) * spacingY;
    if (firstGridY > maxY) {
        firstGridY -= spacingY;
    }
    for (let y = firstGridY; y <= maxY; y += spacingY) {
        const canvasY = height / 2 - (y - centerYValue) * scaleY;
        ctx.beginPath();
        ctx.moveTo(0, canvasY);
        ctx.lineTo(width, canvasY);
        ctx.stroke();
    }
    
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
    ctx.lineWidth = 1;
    
    if (minY <= 0 && maxY >= 0) {
        const axisY = height / 2 - (0 - centerYValue) * scaleY;
        ctx.beginPath();
        ctx.moveTo(0, axisY);
        ctx.lineTo(width, axisY);
        ctx.stroke();
    }
    if (minX <= 0 && maxX >= 0) {
        const axisX = (0 - centerXValue) * scaleX + width / 2;
        ctx.beginPath();
        ctx.moveTo(axisX, 0);
        ctx.lineTo(axisX, height);
        ctx.stroke();
    }
    
    ctx.font = '10px sans-serif'; 
    
    const tickLength = 6;  
    
    if (minY <= 0 && maxY >= 0) {
        const axisY = height / 2 - (0 - centerYValue) * scaleY;
        let textOffsetY;
        if (axisY > height - 20) {
            ctx.textBaseline = 'bottom';
            textOffsetY = -2;
        } else {
            ctx.textBaseline = 'top';
            textOffsetY = 2;
        }
        
        for (let x = firstGridX; x <= maxX; x += spacingX) {
            const canvasX = (x - centerXValue) * scaleX + width / 2;
            ctx.beginPath();
            ctx.moveTo(canvasX, axisY - tickLength / 2);
            ctx.lineTo(canvasX, axisY + tickLength / 2);
            ctx.stroke();
            let label = x;
            if (Math.abs(x) < 1e-6) {
                label = 0;
            } else if (x % 1 !== 0) {
                label = parseFloat(x.toFixed(2));
            }
            let align = 'center';
            if (canvasX < 20) {
                align = 'left';
            } else if (canvasX > width - 20) {
                align = 'right';
            }
            ctx.textAlign = align;
            ctx.fillText(label, canvasX, axisY + textOffsetY);
        }
    }
    
    if (minX <= 0 && maxX >= 0) {
        const axisX = (0 - centerXValue) * scaleX + width / 2;
        let textAlign;
        let textOffsetX;
        if (axisX < 20) {
            textAlign = 'left';
            textOffsetX = 4;
        } else {
            textAlign = 'right';
            textOffsetX = -4;
        }
        ctx.textAlign = textAlign;
        ctx.textBaseline = 'middle';  
        
        for (let y = firstGridY; y <= maxY; y += spacingY) {
            const canvasY = height / 2 - (y - centerYValue) * scaleY;
            ctx.beginPath();
            ctx.moveTo(axisX - tickLength / 2, canvasY);
            ctx.lineTo(axisX + tickLength / 2, canvasY);
            ctx.stroke();
            let label = y;
            if (Math.abs(y) < 1e-6) {
                label = 0;
            } else if (y % 1 !== 0) {
                label = parseFloat(y.toFixed(2));
            }
            ctx.fillText(label, axisX + textOffsetX, canvasY);
        }
    }
    
    ctx.restore();
    
    if (confirmedObjects && confirmedObjects.length > 0) {
        confirmedObjects.forEach((obj) => {
            const objPoints = obj.geometry || [];
            if (objPoints.length > 0) {
                const objectColor = obj.color || '#0066cc';
                ctx.fillStyle = objectColor;
                ctx.strokeStyle = objectColor;
                ctx.lineWidth = 3;
                
                objPoints.forEach((point, index) => {
                    const canvasX = (point.x - centerXValue) * scaleX + width / 2;
                    const canvasY = height / 2 - (point.y - centerYValue) * scaleY;
                    
                    ctx.beginPath();
                    ctx.arc(canvasX, canvasY, 4, 0, 2 * Math.PI);
                    ctx.fill();
                });
                
                if (objPoints.length > 1) {
                    ctx.beginPath();
                    let pathStarted = false;
                    
                    for (let i = 0; i < objPoints.length; i++) {
                        const point = objPoints[i];
                        const canvasX = (point.x - centerXValue) * scaleX + width / 2;
                        const canvasY = height / 2 - (point.y - centerYValue) * scaleY;
                        
                        if (!pathStarted) {
                            ctx.moveTo(canvasX, canvasY);
                            pathStarted = true;
                        } else {
                            ctx.lineTo(canvasX, canvasY);
                        }
                    }
                    
                    ctx.stroke();
                }
            }
        });
    }
    
    if (points && points.length > 0) {
        ctx.fillStyle = '#ff0000';
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        
        points.forEach((point, index) => {
            const canvasX = (point.x - centerXValue) * scaleX + width / 2;
            const canvasY = height / 2 - (point.y - centerYValue) * scaleY;
            
            const isHovered = index === hoveredPointIndex;
            
            if (isHovered) {
                ctx.fillStyle = '#ffaa00';
                ctx.strokeStyle = '#ffaa00';
                ctx.lineWidth = 3;
            } else {
                ctx.fillStyle = '#ff0000';
                ctx.strokeStyle = '#ff0000';
                ctx.lineWidth = 2;
            }
            
            ctx.beginPath();
            if (isHovered) {
                ctx.arc(canvasX, canvasY, 7, 0, 2 * Math.PI); 
            } else {
                ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
            }
            ctx.fill();
            
            ctx.font = isHovered ? '14px sans-serif' : '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = isHovered ? '#ffaa00' : '#ff0000';
            
            const duplicateIndices = points
                .map((p, i) => ({ point: p, index: i }))
                .filter(({ point: p }) => Math.abs(p.x - point.x) < 0.01 && Math.abs(p.y - point.y) < 0.01)
                .map(({ index: i }) => i);
            
            if (duplicateIndices.length > 1) {
                const numberText = duplicateIndices.map(i => i + 1).join(',');
                ctx.fillText(numberText, canvasX, canvasY - (isHovered ? 10 : 8));
            } else {
                ctx.fillText((index + 1).toString(), canvasX, canvasY - (isHovered ? 10 : 8));
            }
        });
        
        if (points.length > 1) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            let pathStarted = false;
            
            for (let i = 0; i < points.length; i++) {
                const point = points[i];
                const canvasX = (point.x - centerXValue) * scaleX + width / 2;
                const canvasY = height / 2 - (point.y - centerYValue) * scaleY;
                
                if (!pathStarted) {
                    ctx.moveTo(canvasX, canvasY);
                    pathStarted = true;
                } else {
                    ctx.lineTo(canvasX, canvasY);
                }
            }
            
            ctx.stroke();
        }
    }

    if (sensorPosition && (sensorPosition.x !== 0 || sensorPosition.y !== 0 || sensorPosition.x === 0 && sensorPosition.y === 0)) {
        const sensorCanvasX = (sensorPosition.x - centerXValue) * scaleX + width / 2;
        const sensorCanvasY = height / 2 - (sensorPosition.y - centerYValue) * scaleY;
        
        ctx.fillStyle = '#000000';
        
        ctx.beginPath();
        ctx.arc(sensorCanvasX, sensorCanvasY, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        if (sensorPosition.direction !== undefined) {
            const directionRad = sensorPosition.direction * Math.PI / 180;
            
            const lineLength = Math.max(width, height) * 2;
            const endX = sensorCanvasX + Math.cos(directionRad) * lineLength;
            const endY = sensorCanvasY - Math.sin(directionRad) * lineLength;
            
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 5]);
            
            ctx.beginPath();
            ctx.moveTo(sensorCanvasX, sensorCanvasY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            ctx.setLineDash([]);
            
            if (sensorPosition.fieldOfView !== undefined && sensorPosition.fieldOfView > 0) {
                const fieldOfViewRad = sensorPosition.fieldOfView * Math.PI / 180;
                const leftBoundaryRad = directionRad - fieldOfViewRad / 2;
                const rightBoundaryRad = directionRad + fieldOfViewRad / 2;
                
                const leftEndX = sensorCanvasX + Math.cos(leftBoundaryRad) * lineLength;
                const leftEndY = sensorCanvasY - Math.sin(leftBoundaryRad) * lineLength;
                const rightEndX = sensorCanvasX + Math.cos(rightBoundaryRad) * lineLength;
                const rightEndY = sensorCanvasY - Math.sin(rightBoundaryRad) * lineLength;
                
                ctx.strokeStyle = 'rgba(0, 100, 255, 0.7)';
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
                
                ctx.beginPath();
                ctx.moveTo(sensorCanvasX, sensorCanvasY);
                ctx.lineTo(leftEndX, leftEndY);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(sensorCanvasX, sensorCanvasY);
                ctx.lineTo(rightEndX, rightEndY);
                ctx.stroke();
                
                if (sensorPosition.angleStep !== undefined && sensorPosition.angleStep > 0) {
                    const angleStepRad = sensorPosition.angleStep * Math.PI / 180;
                    
                    ctx.strokeStyle = 'rgba(0, 150, 255, 0.5)';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([3, 2]);
                    
                    const halfFieldOfView = fieldOfViewRad / 2;
                    const numSteps = Math.floor(halfFieldOfView / angleStepRad);
                    
                    for (let i = 1; i <= numSteps; i++) {
                        const leftStepRad = directionRad - (i * angleStepRad);
                        const leftStepEndX = sensorCanvasX + Math.cos(leftStepRad) * lineLength;
                        const leftStepEndY = sensorCanvasY - Math.sin(leftStepRad) * lineLength;
                        
                        ctx.beginPath();
                        ctx.moveTo(sensorCanvasX, sensorCanvasY);
                        ctx.lineTo(leftStepEndX, leftStepEndY);
                        ctx.stroke();
                        
                        const rightStepRad = directionRad + (i * angleStepRad);
                        const rightStepEndX = sensorCanvasX + Math.cos(rightStepRad) * lineLength;
                        const rightStepEndY = sensorCanvasY - Math.sin(rightStepRad) * lineLength;
                        
                        ctx.beginPath();
                        ctx.moveTo(sensorCanvasX, sensorCanvasY);
                        ctx.lineTo(rightStepEndX, rightStepEndY);
                        ctx.stroke();
                    }
                }
                
                ctx.setLineDash([]);
            }
        }
    }

    if (calcs && calcs.length > 0) {

        // * ↓ 1. Draw accurate data:
        calcs.forEach((calcResult, index) => {
            
            if (calcResult.accurate && calcResult.accurate.crossingPoint) {
                const crossingCanvasX = (calcResult.accurate.crossingPoint.x - centerXValue) * scaleX + width / 2;
                const crossingCanvasY = height / 2 - (calcResult.accurate.crossingPoint.y - centerYValue) * scaleY;
                
                ctx.fillStyle = '#0066ff'; 
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3;
                
                ctx.beginPath();
                ctx.arc(crossingCanvasX, crossingCanvasY, 10, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(crossingCanvasX, crossingCanvasY, 3, 0, 2 * Math.PI);
                ctx.fill();
                
                ctx.fillStyle = '#0066ff';
                ctx.font = 'bold 12px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText('A', crossingCanvasX, crossingCanvasY - 12);
            }
        });

        // * ↓ 2. Draw accurate including range data:
        calcs.forEach((calcResult, index) => {
            if (calcResult.accurate_including_range && calcResult.accurate_including_range.point.crossingPoint) {
                const crossingCanvasX = (calcResult.accurate_including_range.point.crossingPoint.x - centerXValue) * scaleX + width / 2;
                const crossingCanvasY = height / 2 - (calcResult.accurate_including_range.point.crossingPoint.y - centerYValue) * scaleY;

                ctx.fillStyle = '#00cc44'; 
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                
                ctx.beginPath();
                ctx.arc(crossingCanvasX, crossingCanvasY, 8, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                
                // Add cross pattern inside
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(crossingCanvasX - 4, crossingCanvasY);
                ctx.lineTo(crossingCanvasX + 4, crossingCanvasY);
                ctx.moveTo(crossingCanvasX, crossingCanvasY - 4);
                ctx.lineTo(crossingCanvasX, crossingCanvasY + 4);
                ctx.stroke();
                
                // Label
                ctx.fillStyle = '#00cc44';
                ctx.font = 'bold 12px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText('R', crossingCanvasX, crossingCanvasY - 10);
            }
        });

        // * ↓ 3. Draw simulation data:
        calcs.forEach((calcResult, index) => {
            if (calcResult.simulation && Array.isArray(calcResult.simulation)) {
                calcResult.simulation.forEach((simulationPoint, simIndex) => {
                    if (simulationPoint.simulation && simulationPoint.simulation.crossingPoint) {
                        const crossingCanvasX = (simulationPoint.simulation.crossingPoint.x - centerXValue) * scaleX + width / 2;
                        const crossingCanvasY = height / 2 - (simulationPoint.simulation.crossingPoint.y - centerYValue) * scaleY;

                        const likelihood = simulationPoint.likelihood || 0;
                        const normalizedLikelihood = Math.max(0, Math.min(100, likelihood)) / 100;
                        
                        let r, g, b;
                        if (normalizedLikelihood < 0.5) {
                            const t = normalizedLikelihood / 0.5;
                            r = 255;
                            g = Math.floor(255 * t);
                            b = 0;
                        } else {
                            const t = (normalizedLikelihood - 0.5) / 0.5;
                            r = Math.floor(255 * (1 - t));
                            g = 255;
                            b = 0;
                        }
                        
                        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 1;
                        
                        const pointSize = 2 + (normalizedLikelihood * 4); 
                        
                        ctx.beginPath();
                        ctx.arc(crossingCanvasX, crossingCanvasY, pointSize, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.stroke();
                        
                        if (normalizedLikelihood > 0.7) {
                            ctx.fillStyle = '#000000';
                            ctx.font = '10px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(`${Math.round(likelihood)}%`, crossingCanvasX, crossingCanvasY - pointSize - 8);
                        }
                    }
                });
            }
        });

        // * ↓ 4. Draw global simulated point:
        calcs.forEach((calcResult, index) => {
            if (calcResult.globalSimulatedPoint && calcResult.globalSimulatedPoint.x !== undefined && calcResult.globalSimulatedPoint.y !== undefined) {
                const globalCanvasX = (calcResult.globalSimulatedPoint.x - centerXValue) * scaleX + width / 2;
                const globalCanvasY = height / 2 - (calcResult.globalSimulatedPoint.y - centerYValue) * scaleY;

                ctx.fillStyle = '#ffff00';  
                ctx.strokeStyle = '#000000'; 
                ctx.lineWidth = 2;
                
                ctx.beginPath();
                ctx.arc(globalCanvasX, globalCanvasY, 12, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(globalCanvasX - 8, globalCanvasY);
                ctx.lineTo(globalCanvasX + 8, globalCanvasY);
                ctx.moveTo(globalCanvasX, globalCanvasY - 8);
                ctx.lineTo(globalCanvasX, globalCanvasY + 8);
                ctx.stroke();
                
                ctx.fillStyle = '#000000';
                ctx.font = 'bold 12px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText('G', globalCanvasX, globalCanvasY - 14);
            }
        });
    }
}

export default drawCarthesianPlane;
