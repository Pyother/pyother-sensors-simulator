// * React and Redux:
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setInitialState } from './features/data/ConfigSlice';
import { setDeviceType } from './features/layout/DeviceTypeSlice';
import { setMaterials } from './features/data/MaterialsSlice';
 
// * MUI:
import { Stack } from '@mui/material';
 
// * Views:
import ConfigurationView from './views/configurationView/ConfigurationView';
import MainView from './views/mainView/MainView';

// * Components:
import Header from './components/header/Header';

// * Serivces:
import getData from './services/data/getData';

const App = () => {

    const dispatch = useDispatch();
    const view = useSelector(state => state.view.view);

    // * Config: initial state:
    useEffect(() => {
        getData('config', dispatch, setInitialState);
        getData('materials', dispatch, setMaterials);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            dispatch(setDeviceType(window.innerWidth));
        }

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [dispatch]);

    return (
        <>
            <Header />
            <div className="center" style={{paddingTop: 'var(--padding)'}}>
                <Stack className="app center">
                {
                    view === 'configuration' ? 
                    <ConfigurationView /> :
                    <MainView />
                }
                </Stack>
            </div>
        </>
    )
}


export default App;
