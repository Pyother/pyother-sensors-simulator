import { createSlice } from '@reduxjs/toolkit';

const objectsSlice = createSlice({
    name: 'objects',
    initialState: {
        selectedObjects: []
    }, 
    reducers: {
        addObject: (state, action) => {
            const { id, geometry, material } = action.payload;
            console.log('Adding object:', id, geometry, material);
            state.selectedObjects.push({
                id,
                geometry,
                material
            });
        }, 
        removeObject: (state, action) => {
            const { id } = action.payload;
            state.selectedObjects = state.selectedObjects.filter(obj => obj.id !== id);
        }
    }
})

export const { addObject, removeObject } = objectsSlice.actions;
export default objectsSlice.reducer;