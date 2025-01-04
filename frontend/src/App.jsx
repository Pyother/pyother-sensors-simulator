// * React and Redux:
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setInitialState } from './features/data/ConfigSlice';

// * MUI:
import { 
    Stack,
    AppBar, 
    Toolbar, 
    Typography, 
    IconButton, 
    Divider,
    Button 
} from '@mui/material';
 
// * Views:
import ConfigurationView from './views/configurationView/ConfigurationView';
import MainView from './views/mainView/MainView';

// * Icons:
import { GiMicrochip } from "react-icons/gi";
import { GoGear } from "react-icons/go";
import { GoHome } from "react-icons/go";

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
            <AppBar position="static" className="center" style={{boxShadow: 'none', width: '100%', borderBottom: '1px solid var(--border-color)', position: 'fixed', top: 0, left: 0, zIndex: 1000}}>
                <Toolbar className="bg-secondary">
                    <GiMicrochip style={{fontSize: 'x-large', marginRight: '0.5em'}} />
                    <Typography variant="h6" component="div">
                        Sensors Simulator
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className="center">
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
