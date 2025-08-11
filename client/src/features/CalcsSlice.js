import { createSlice } from '@reduxjs/toolkit';

const calcsSlice = createSlice({
    name: 'calcs',
    initialState: {
        calcs: [],
    },
    reducers: {
        addCalc: (state, action) => {
            state.calcs.push(action.payload);
        }
    }
});

export const { addCalc } = calcsSlice.actions;
export default calcsSlice.reducer;