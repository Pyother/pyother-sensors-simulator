// * React and Redux:
import React, { 
    useState, 
    useEffect, 
    createContext 
} from 'react';
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
    IconButton,
    Button
} from '@mui/material';

// * Own items:
import Chart from './Chart';
import Console from './Console';

// * Icons: 
import { HiOutlineSave } from "react-icons/hi";
import { HiOutlineArrowUturnLeft } from "react-icons/hi2";
import { HiOutlineArrowUturnRight } from "react-icons/hi2";

// * Styles:
import './chartItem.css';

export const ConsoleContext = createContext();

const ChartItem = ({ task }) => {

    const config = useSelector((state) => state.config);
    const inputObjects = useSelector((state) => state.inputObjects.objectsArray);
    const [chartProps, setChartProps] = useState({});
    const [consoleProps, setConsoleProps] = useState({
        position: {
            x: 0,
            y: 0
        },
        movementStep: 10,
        angle: 0
    });
    const [inputObject, setInputObject] = useState({ name: "", points: [] });

    useEffect(() => {
        const itemFromConfig = config.tasks.find((item) => item.name === task.name);
        setChartProps({
            name: itemFromConfig.name,
            description: itemFromConfig.description,
            inputObjectRequired: itemFromConfig.inputObjectRequired,
            movementRequired: itemFromConfig.movementRequired,
            angleRegulation: itemFromConfig.sensorAngleRegulationRequired
        });
    }, [config, task]);

    return (
        <Grid 
            item xs={12} sm={12} md={6} 
            className="chart-item-container"
        >   
            <ConsoleContext.Provider value={{ consoleProps, setConsoleProps }}> 
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
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            color="primary"
                        >
                            New measurement
                        </Button>
                        <IconButton>
                            <HiOutlineArrowUturnLeft />
                        </IconButton>
                        <IconButton>
                            <HiOutlineArrowUturnRight />
                        </IconButton>
                        <IconButton>
                            <HiOutlineSave />
                        </IconButton>
                    </Stack>
                    {
                        chartProps.movementRequired || chartProps.angleRegulation ? (
                            <Console 
                                movement={chartProps.movementRequired}
                                angleRegulation={chartProps.angleRegulation} 
                            />
                        ) : null
                    }
                </Stack>
            </ConsoleContext.Provider>
        </Grid>
    )
}

export default ChartItem;