// * React and Redux:
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// * MUI:
import {
    Grid,
    Stack,
    Typography,
    Select,
    FormControl,
    MenuItem,
    InputLabel,
} from '@mui/material';

// * Chart:
import Chart from './Chart';

// * Styles:
import './chartItem.css';

const ChartItem = ({ task }) => {

    const config = useSelector((state) => state.config);
    const inputObjects = useSelector((state) => state.inputObjects.objectsArray);
    const [chartProps, setChartProps] = useState({});
    const [inputObject, setInputObject] = useState({ name: "", points: [] });

    useEffect(() => {
        const itemFromConfig = config.tasks.find((item) => item.name === task.name);
        setChartProps({
            name: itemFromConfig.name,
            description: itemFromConfig.description,
            inputObjectRequired: itemFromConfig.inputObjectRequired,
        });
    }, [config, task]);

    return (
        <Grid 
            item xs={12} sm={12} md={6} 
            className="chart-item-container"
        >   
            <Stack spacing={2}>
                <Typography variant="body1" className="task-item-title">{task.name}</Typography>
                <p className="text-secondary">
                    {chartProps.description ? chartProps.description : "No description available"}
                </p>
                {
                    chartProps.inputObjectRequired ? (
                        <FormControl fullWidth>
                            <InputLabel>Input objects</InputLabel>
                            <Select
                                className="select"
                                value={inputObject}
                                onChange={(e) => setInputObject(e.target.value)}
                                label="Input objects"
                            >
                                {
                                    inputObjects.map((item, index) => (
                                        <MenuItem key={index} value={item}>
                                            {item.name}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    ) : null
                }
                <Chart inputObject={inputObject} />
            </Stack>
        </Grid>
    )
}

export default ChartItem;