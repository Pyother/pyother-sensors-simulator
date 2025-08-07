function drawCarthesianPlane(canvas, zoom = 1, centerXValue = 0, centerYValue = 0, points = [], hoveredPointIndex = -1, confirmedObjects = []) {
    
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
    
    // Draw confirmed objects (permanently visible)
    if (confirmedObjects && confirmedObjects.length > 0) {
        confirmedObjects.forEach((obj) => {
            const objPoints = obj.geometry || [];
            if (objPoints.length > 0) {
                // Set style for confirmed objects - use object's color or default blue
                const objectColor = obj.color || '#0066cc';
                ctx.fillStyle = objectColor;
                ctx.strokeStyle = objectColor;
                ctx.lineWidth = 3;
                
                // Draw points for confirmed object
                objPoints.forEach((point, index) => {
                    const canvasX = (point.x - centerXValue) * scaleX + width / 2;
                    const canvasY = height / 2 - (point.y - centerYValue) * scaleY;
                    
                    // Draw point
                    ctx.beginPath();
                    ctx.arc(canvasX, canvasY, 4, 0, 2 * Math.PI);
                    ctx.fill();
                });
                
                // Draw lines connecting points for confirmed object
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
    
    // Draw points after restoring context to ensure they're visible
    if (points && points.length > 0) {
        ctx.fillStyle = '#ff0000';
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        
        points.forEach((point, index) => {
            const canvasX = (point.x - centerXValue) * scaleX + width / 2;
            const canvasY = height / 2 - (point.y - centerYValue) * scaleY;
            
            // Determine if this point is hovered
            const isHovered = index === hoveredPointIndex;
            
            // Set colors based on hover state
            if (isHovered) {
                ctx.fillStyle = '#ffaa00'; // Orange for hover
                ctx.strokeStyle = '#ffaa00';
                ctx.lineWidth = 3;
            } else {
                ctx.fillStyle = '#ff0000'; // Red for normal
                ctx.strokeStyle = '#ff0000';
                ctx.lineWidth = 2;
            }
            
            // Draw point with hover effect
            ctx.beginPath();
            if (isHovered) {
                ctx.arc(canvasX, canvasY, 7, 0, 2 * Math.PI); // Larger when hovered
            } else {
                ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
            }
            ctx.fill();
            
            // Draw point number
            ctx.font = isHovered ? '14px sans-serif' : '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = isHovered ? '#ffaa00' : '#ff0000';
            
            // Check if this point has duplicates (for closed shapes)
            const duplicateIndices = points
                .map((p, i) => ({ point: p, index: i }))
                .filter(({ point: p }) => Math.abs(p.x - point.x) < 0.01 && Math.abs(p.y - point.y) < 0.01)
                .map(({ index: i }) => i);
            
            if (duplicateIndices.length > 1) {
                // Show all indices for this position
                const numberText = duplicateIndices.map(i => i + 1).join(',');
                ctx.fillText(numberText, canvasX, canvasY - (isHovered ? 10 : 8));
            } else {
                ctx.fillText((index + 1).toString(), canvasX, canvasY - (isHovered ? 10 : 8));
            }
        });
        
        // Draw lines connecting points
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
}

export default drawCarthesianPlane;
