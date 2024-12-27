import { configureStore } from '@reduxjs/toolkit';

// * Layout features:
import ViewReducer from '../features/layout/ViewSlice';

// * Data features:
import ConfigReducer from '../features/data/ConfigSlice';
import SelectionsReducer from '../features/data/SelectionsSlice';

const store = configureStore({
    reducer: {
        view: ViewReducer,
        config: ConfigReducer,
        selections: SelectionsReducer,
    }
});

export default store;