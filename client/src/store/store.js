import { configureStore } from '@reduxjs/toolkit';

// * Reducers:
import CalcsReducer from '../features/CalcsSlice';
import ConfigReducer from '../features/ConfigSlice';
import MaterialsReducer from '../features/MaterialsSlice';
import DrawingModeReducer from '../features/DrawingModeSlice';
import FormReducer from '../features/FormSlice';

const store = configureStore({
    reducer: {
        calcs: CalcsReducer,
        config: ConfigReducer,
        materials: MaterialsReducer,
        drawingMode: DrawingModeReducer,
        form: FormReducer
    }
});

export default store;