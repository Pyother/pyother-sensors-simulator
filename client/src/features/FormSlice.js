import { createSlice } from '@reduxjs/toolkit';

const formSlice = createSlice({
    name: 'form',
    initialState: {
        // Sensor position and configuration
        sensorPosition: {
            x: 0,
            y: 0,
            direction: 30,
            angleStep: 3,
            fieldOfView: 0
        },
        selectedSensor: null,
        
        // Geometry for creating objects
        currentGeometry: {
            points: []
        },
        
        // Created objects
        objects: {
            selectedObjects: []
        }
    },
    reducers: {
        // Sensor position reducers
        setSensorPosition: (state, action) => {
            state.sensorPosition.x = action.payload.x;
            state.sensorPosition.y = action.payload.y;
        },
        setSensorX: (state, action) => {
            state.sensorPosition.x = action.payload;
        },
        setSensorY: (state, action) => {
            state.sensorPosition.y = action.payload;
        },
        setSensorDirection: (state, action) => {
            state.sensorPosition.direction = action.payload;
        },
        setSensorAngleStep: (state, action) => {
            state.sensorPosition.angleStep = action.payload;
        },
        setSensorFieldOfView: (state, action) => {
            state.sensorPosition.fieldOfView = action.payload;
        },
        setSelectedSensor: (state, action) => {
            state.selectedSensor = action.payload;
        },
        
        // Geometry reducers
        addPoint: (state, action) => {
            const { x, y } = action.payload;
            state.currentGeometry.points.push({ x, y });
        },
        removeLastPoint: (state) => {
            if (state.currentGeometry.points.length > 0) {
                state.currentGeometry.points.pop();
            } 
        },
        clearPoints: (state) => {
            state.currentGeometry.points = [];
        },
        
        // Objects reducers
        addObject: (state, action) => {
            const { id, name, color, geometry, material } = action.payload;
            state.objects.selectedObjects.push({
                id,
                name,
                color,
                geometry,
                material
            });
        }, 
        removeObject: (state, action) => {
            const { id } = action.payload;
            state.objects.selectedObjects = state.objects.selectedObjects.filter(obj => obj.id !== id);
        }
    }
});

export const { 
    setSensorPosition, 
    setSensorX, 
    setSensorY, 
    setSensorDirection, 
    setSensorAngleStep, 
    setSensorFieldOfView,
    setSelectedSensor,
    addPoint, 
    removeLastPoint, 
    clearPoints,
    addObject, 
    removeObject 
} = formSlice.actions;

export default formSlice.reducer;
