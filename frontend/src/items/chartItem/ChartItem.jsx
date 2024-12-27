// * React and Redux:
import React from 'react';
import { useSelector } from 'react-redux';

// * MUI:
import {
    Grid,
    Stack,
    Typography,
} from '@mui/material';

// * Styles:
import './chartItem.css';

const ChartItem = ({ task }) => {

    const config = useSelector((state) => state.config);

    return (
        <Grid 
            item xs={12} sm={12} md={6} 
            spacing={2} 
            className="chart-item-container"
        >
            <Typography variant="body1" className="task-item-title">{task.name}</Typography>
            <p className="text-secondary">
                {(config.tasks.find((item) => item.name === task.name)).description}
            </p>
        </Grid>
    )
}

export default ChartItem;