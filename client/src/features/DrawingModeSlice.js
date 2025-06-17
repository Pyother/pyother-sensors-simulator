import { createSlice } from '@reduxjs/toolkit';

const drawingModeSlice = createSlice({
    name: 'drawingMode',
    initialState: {
        on: false
    },
    reducers: {
        toggleDrawingMode: (state) => {
            state.on = !state.on;
        }
    }
});

export const { toggleDrawingMode } = drawingModeSlice.actions;
export default drawingModeSlice.reducer;