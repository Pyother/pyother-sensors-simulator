import { createSlice } from '@reduxjs/toolkit';

const InputObjectsSlice = createSlice({
    name: 'inputObjects',
    initialState: {
        objectsArray: []
    },
    reducers: {
        addObject: (state, action) => {
            state.objectsArray.push(action.payload);
        },
        removeObject: (state, action) => {
            state.objectsArray.splice(state.objectsArray.indexOf(action.payload), 1);
        }
    }
})

export const { addObject, removeObject } = InputObjectsSlice.actions;
export default InputObjectsSlice.reducer;