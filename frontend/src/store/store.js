import { configureStore } from '@reduxjs/toolkit';

// * Layout features:
import ViewReducer from '../features/layout/ViewSlice';

const store = configureStore({
    reducer: {
        view: ViewReducer,
    }
});

export default store;