import { createSlice } from '@reduxjs/toolkit';

const InputObjectsSlice = createSlice({
    name: 'inputObjects',
    initialState: {
        objectsArray: []
    },
    reducers: {
        addObject: (state, action) => {
            state.objectsArray.push(action.payload);
        }
    }
})

export const { addObject } = InputObjectsSlice.actions;
export default InputObjectsSlice.reducer;