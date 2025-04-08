import { createSlice } from '@reduxjs/toolkit';

const SelectionsSlice = createSlice({
    name: 'selections',
    initialState: {
        selectionsArray: [],
    },
    reducers: {
        addSelection(state, action) {
            state.selectionsArray.push(action.payload);
        },
        removeSelection(state, action) {
            state.selectionsArray = state.selectionsArray.filter(selection => selection.name !== action.payload);
        },
        clearSelections(state) {
            state.selectionsArray = [];
        },
        updateSelection(state, action) {
            const index = state.selectionsArray.findIndex(selection => selection.name === action.payload.name);
            if (index !== -1) {
                state.selectionsArray[index] = { ...state.selectionsArray[index], ...action.payload.data };
            }
        }
    }
});

export const { addSelection, removeSelection, clearSelections, updateSelection } = SelectionsSlice.actions;
export default SelectionsSlice.reducer;
