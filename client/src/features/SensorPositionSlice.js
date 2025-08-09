import { createSlice } from '@reduxjs/toolkit';

const sensorPositionSlice = createSlice({
    name: 'sensorPosition',
    initialState: {
        x: 0,
        y: 0,
        direction: 0
    },
    reducers: {
        setSensorPosition: (state, action) => {
            state.x = action.payload.x;
            state.y = action.payload.y;
        },
        setSensorX: (state, action) => {
            state.x = action.payload;
        },
        setSensorY: (state, action) => {
            state.y = action.payload;
        },
        setSensorDirection: (state, action) => {
            state.direction = action.payload;
        }
    }
});

export const { setSensorPosition, setSensorX, setSensorY, setSensorDirection } = sensorPositionSlice.actions;
export default sensorPositionSlice.reducer;
