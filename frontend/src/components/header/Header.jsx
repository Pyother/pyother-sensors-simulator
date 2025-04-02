// * React and Redux:
import React from 'react';
import { useSelector } from 'react-redux';

// * MUI:
import {
    Stack,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
} from '@mui/material';

// * Icons:
import { GiMicrochip } from "react-icons/gi";
import { 
    IoSettingsOutline,
    IoHomeOutline,
    IoStatsChartOutline,
} from "react-icons/io5";

// * Assets:
import logo from '../../assets/images/logo-heatwave.png';
import './header.css';

const Header = () => {

    const deviceType = useSelector(state => state.deviceType.deviceType);
    const view = useSelector(state => state.view.view);

    const iconArray = [
        {
            icon: <IoSettingsOutline />,
            text: 'Settings',
            link: '/settings',
        },
        {
            icon: <IoHomeOutline />,
            text: 'Home',
            link: '/home',
        },
        {
            icon: <IoStatsChartOutline />,
            text: 'Statistics',
            link: '/statistics',
        }
    ]

    return (
        <AppBar 
            position="static"
            className="header full-width"
        >
            <Stack direction="row" spacing={2}>
                <Toolbar className="bg-secondary full-width" >
                    <img src={logo} className="logo" />
                    {
                        deviceType === 'desktop' || deviceType === 'small-desktop' || deviceType === 'tablet' ?
                        <Stack>
                            <Typography variant="p" className="title">
                                Sensors Simulator
                            </Typography>
                            <Typography variant="h6" className="view" style={{ textTransform: 'capitalize' }}>
                                {view}
                            </Typography>
                        </Stack> : null
                    }
                </Toolbar>
                <Stack 
                    className="right full-width"
                    direction="row"
                    spacing={2}
                >
                    {
                        iconArray.map((icon, index) => (
                            <IconButton key={index} className="icon-button" >
                                {icon.icon}
                            </IconButton>
                        ))
                    }
                </Stack>
            </Stack>
        </AppBar>
    )
}

export default Header;
