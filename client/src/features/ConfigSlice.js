import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
    name: "config",
    initialState: {
        availableSensors: []
    },
    reducers: {
        setAvailableSensors: (state, action) => {
            state.availableSensors = action.payload;
        }
    }
});

export const { setAvailableSensors } = configSlice.actions;
export default configSlice.reducer;