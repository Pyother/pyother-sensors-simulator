function drawCarthesianPlane(canvas, zoom = 1, centerXValue = 0, centerYValue = 0, points = []) {
    
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
    
    // Draw points after restoring context to ensure they're visible
    if (points && points.length > 0) {
        ctx.fillStyle = '#ff0000';
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        
        points.forEach((point, index) => {
            const canvasX = (point.x - centerXValue) * scaleX + width / 2;
            const canvasY = height / 2 - (point.y - centerYValue) * scaleY;
            
            // Draw point (removed visibility check to ensure all points are always drawn)
            ctx.beginPath();
            ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw point number
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = '#ff0000';
            ctx.fillText((index + 1).toString(), canvasX, canvasY - 8);
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
