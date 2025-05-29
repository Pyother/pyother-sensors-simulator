import { configureStore } from '@reduxjs/toolkit';

// * Reducers:
import CalcsReducer from '../features/CalcsSlice';

const store = configureStore({
    reducer: {
        calcs: CalcsReducer,
    }
});

export default store;