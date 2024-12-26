import { createSlice } from '@reduxjs/toolkit';

const ConfigSlice = createSlice({
    name: 'config',
    initialState: {
        sensors: [],
        measurementTypes: [],
        tasks: []
    },
    reducers: {
        setInitialState(state, action) {
            state.sensors = action.payload.availableSensors;
            state.measurementTypes = action.payload.availableMeasurementTypes;
            state.tasks = action.payload.availableTasks;
        },
        addSensor(state, action) {
            state.sensors.push(action.payload);
        },
        addMeasurementType(state, action) {
            state.measurementTypes.push(action.payload);
        },
        addTask(state, action) {
            state.tasks.push(action.payload);
        },
        removeSensor(state, action) {
            state.sensors = state.sensors.filter(sensor => sensor !== action.payload);
        },
        removeTask(state, action) {
            state.tasks = state.tasks.filter(task => task !== action.payload);
        },
    },
});

export default ConfigSlice.reducer;
export const { setInitialState, addSensor, addMeasurementType, addTask, removeSensor, removeTask } = ConfigSlice.actions;