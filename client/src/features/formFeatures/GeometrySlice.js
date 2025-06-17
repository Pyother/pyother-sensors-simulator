import { createSlice } from '@reduxjs/toolkit';

const geometrySlice = createSlice({
    name: 'geometry',
    initialState: {
        points: []
    }, 
    reducers: {
        addPoint: (state, action) => {
            const { x, y } = action.payload;
            console.log('Adding point:', x, y);
            state.points.push({ x, y });
        },
        removeLastPoint: (state) => {
            if (state.points.length > 0) {
                console.log('Removing last point:', state.points[state.points.length - 1]);
                state.points.pop();
            } 
        },
        clearPoints: (state) => {
            console.log('Clearing all points');
            state.points = [];
        }
    }
})

export const { addPoint, removeLastPoint, clearPoints } = geometrySlice.actions;
export default geometrySlice.reducer;