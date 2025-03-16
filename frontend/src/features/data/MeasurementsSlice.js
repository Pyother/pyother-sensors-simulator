import { createSlice } from '@reduxjs/toolkit';

const MeasurementsSlice = createSlice({
    name: 'measurements',
    initialState: {
        measurementsArray: [],
    },
    reducers: {
        addMeasurement(state, action) {
            state.measurementsArray.push(action.payload);
        }
    }
});

export const { addMeasurement } = MeasurementsSlice.actions;
export default MeasurementsSlice.reducer;