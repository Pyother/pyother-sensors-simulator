import { createSlice } from '@reduxjs/toolkit';

const materialsSlice = createSlice({
    name: 'materials',
    initialState: {
        materials: []
    },
    reducers: {
        setMaterials: (state, action) => {
            state.materials = action.payload;
        },
    }
});

export const { setMaterials } = materialsSlice.actions;
export default materialsSlice.reducer;