import { configureStore } from '@reduxjs/toolkit';

// * Reducers:
import CalcsReducer from '../features/CalcsSlice';
import ConfigReducer from '../features/ConfigSlice';
import MaterialsReducer from '../features/MaterialsSlice';

const store = configureStore({
    reducer: {
        calcs: CalcsReducer,
        config: ConfigReducer,
        materials: MaterialsReducer
    }
});

export default store;