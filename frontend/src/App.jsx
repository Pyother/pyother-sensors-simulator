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
    Button 
} from '@mui/material';
 
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
            <AppBar position="static">
                <Toolbar className="bg-secondary">
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Sensors Simulator
                    </Typography>
                </Toolbar>
            </AppBar>
            <Stack className="app center">
            {
                view === 'configuration' ? 
                <ConfigurationView /> :
                <MainView />
            }
            </Stack>
        </>
    )
}

export default App;
