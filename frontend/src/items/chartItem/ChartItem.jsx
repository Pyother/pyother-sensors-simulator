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
    TextField,
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

// * Axios:
import axios from 'axios';

export const ConsoleContext = createContext();
export const InputObjectContext = createContext();

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

    const sendMeasurementRequest = () => {
        axios.post('http://localhost:5000/api/calc/distance', {
            position: consoleProps.position,
            direction: consoleProps.angle,
            inputObject: inputObject.points
        }).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    return (
        <ConsoleContext.Provider value={{ consoleProps, setConsoleProps }}> 
            <InputObjectContext.Provider value={{ inputObject, setInputObject }}>
                <Grid container className="chart-item-container" >
                    <Grid item xs={12} sm={12} md={6} >
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
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={sendMeasurementRequest}
                                >
                                    Measure
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
                                {
                                    chartProps.movementRequired ?
                                    <>
                                        <TextField 
                                            className="select" 
                                            label="Position X"
                                            type="number"
                                            value={consoleProps.position.x}
                                            onChange={(e) => {
                                                if (e.target.value > 500 || e.target.value < -500) return;
                                                else setConsoleProps({ 
                                                    ...consoleProps, position: { x: Math.round(e.target.value * 100) / 100, y: consoleProps.position.y }
                                                });
                                            }}
                                        />
                                        <TextField 
                                            className="select" 
                                            label="Position Y"
                                            type="number"
                                            value={consoleProps.position.y}
                                            onChange={(e) => { 
                                                if (e.target.value > 500 || e.target.value < -500) return;
                                                else setConsoleProps({
                                                    ...consoleProps, position: { x: consoleProps.position.x, y: Math.round(e.target.value * 100) / 100 }
                                                });
                                            }}
                                        />
                                    </> : null
                                }
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
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Chart inputObject={inputObject} />
                    </Grid>
                </Grid>
            </InputObjectContext.Provider>
        </ConsoleContext.Provider>
    )
}

export default ChartItem;