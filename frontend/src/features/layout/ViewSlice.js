import { createSlice } from '@reduxjs/toolkit';

const ViewSlice = createSlice({
    name: 'view',
    initialState: {
        view: 'configuration',
    },
    reducers: {
        setView(state, action) {
            state.view = action.payload;
        },
    },
});

export default ViewSlice.reducer;
export const { setView } = ViewSlice.actions;