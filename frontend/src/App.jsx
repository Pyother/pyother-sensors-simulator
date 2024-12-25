// * React and Redux:
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setInitialState } from './features/data/ConfigSlice';
 
// * Views:
import ConfigurationView from './views/configurationView/ConfigurationView';
import MainView from './views/mainView/MainView';

// * Serivces:
import getConfig from './services/data/getConfig';

const App = () => {

    const dispatch = useDispatch();
    const view = useSelector(state => state.view.view);

    // * Config: initial state:
    useEffect(() => {
        getConfig(dispatch, setInitialState);
    }, []);

    return (
        <>
            {
                view === 'configuration' ? 
                <ConfigurationView /> :
                <MainView />
            }
        </>
    )
}

export default App;
