import { configureStore } from '@reduxjs/toolkit';

// * Reducers:
import CalcsReducer from '../features/CalcsSlice';
import ConfigReducer from '../features/ConfigSlice';
import MaterialsReducer from '../features/MaterialsSlice';
import DrawingModeReducer from '../features/DrawingModeSlice';
import ObjectsReducer from '../features/formFeatures/ObjectsSlice';
import GeometryReducer from '../features/formFeatures/GeometrySlice';

const store = configureStore({
    reducer: {
        calcs: CalcsReducer,
        config: ConfigReducer,
        materials: MaterialsReducer,
        drawingMode: DrawingModeReducer,
        objects: ObjectsReducer,
        geometry: GeometryReducer
    }
});

export default store;