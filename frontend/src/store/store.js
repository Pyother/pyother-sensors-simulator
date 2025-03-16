import { configureStore } from '@reduxjs/toolkit';

// * Layout features:
import ViewReducer from '../features/layout/ViewSlice';
import DeviceTypeReducer from '../features/layout/DeviceTypeSlice';

// * Data features:
import ConfigReducer from '../features/data/ConfigSlice';
import SelectionsReducer from '../features/data/SelectionsSlice';
import InputObjectsReducer from '../features/data/InputObjectsSlice';
import MeasurementsReducer from '../features/data/MeasurementsSlice';

const store = configureStore({
    reducer: {
        view: ViewReducer,
        config: ConfigReducer,
        selections: SelectionsReducer,
        inputObjects: InputObjectsReducer,
        deviceType: DeviceTypeReducer,
        measurements: MeasurementsReducer
    }
});

export default store;