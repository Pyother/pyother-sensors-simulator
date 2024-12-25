import { configureStore } from '@reduxjs/toolkit';

// * Layout features:
import ViewReducer from '../features/layout/ViewSlice';

// * Data features:
import ConfigReducer from '../features/data/ConfigSlice';

const store = configureStore({
    reducer: {
        view: ViewReducer,
        mode: ConfigReducer,
    }
});

export default store;