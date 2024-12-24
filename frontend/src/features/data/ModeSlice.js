import { createSlice } from '@reduxjs/toolkit';

const ModeSlice = createSlice({
    name: 'mode',
    initialState: {
        sensors: [],
        actions: []
    },
    reducers: {
        addSensor(state, action) {
            state.sensors.push(action.payload);
        },
        addAction(state, action) {
            state.actions.push(action.payload);
        },
        removeSensor(state, action) {
            state.sensors = state.sensors.filter(sensor => sensor !== action.payload);
        },
        removeAction(state, action) {
            state.actions = state.actions.filter(action => action !== action.payload);
        },
    },
});

export default ModeSlice.reducer;
export const { addSensor, addAction, removeSensor, removeAction } = ModeSlice.actions;