import { createSlice } from '@reduxjs/toolkit';

const MaterialsSlice = createSlice({
    name: 'materials',
    initialState: {
        surfacesParams: [],
    },
    reducers: {
        setMaterials: (state, action) => {
            state.surfacesParams = action.payload.surfacesParams;
        }
    }
})

export const { setMaterials } = MaterialsSlice.actions;
export default MaterialsSlice.reducer;