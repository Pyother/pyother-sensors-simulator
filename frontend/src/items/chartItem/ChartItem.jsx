// * React and Redux:
import React, { 
    useState, 
    useEffect, 
    createContext 
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMeasurement } from '../../features/data/MeasurementsSlice';

// * MUI and StyledComponents:
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
import StyledButton from '../../components/styledComponents/StyledButton';

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

// * UUID:
import { v4 as uuidv4 } from 'uuid';

export const ConsoleContext = createContext();
export const InputObjectContext = createContext();


const ChartItem = ({ task }) => {

    const dispatch = useDispatch();

    // * Features:
    // - config - tasks parameters.
    // - inputObjects - list of defined boundaries of solid objects in the environment.
    // - chartProps - parameters of the current task, taken from the config.
    // - measurementsObject - object containing all measurements done during the task.
    // - consoleProps - properties of the console (position, movement step, angle).
    // - inputObject - object containing the input object for the task.

    const config = useSelector((state) => state.config);
    const inputObjects = useSelector((state) => state.inputObjects.objectsArray);
    const [chartProps, setChartProps] = useState({});
    const [measurementsObject, setMeasurementsObject] = useState({
        id: uuidv4(),
        task: task.name,
        inputObject: null,
        measurements: []
    });
    const [consoleProps, setConsoleProps] = useState({
        position: {
            x: 0,
            y: 0
        },
        movementStep: 10,
        angle: 0
    });
    const [inputObject, setInputObject] = useState({ name: "", points: [] });
    const measurementsArray = useSelector(state => state.measurements.measurementsArray);

    // * Setting task configuration:
    // Items are taken from the config Redux slice.

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


    // * Measurement request:
    // Calculation of the distance measured by each sensor for input object.
    // Input: position, direction, sensor, inputObject.
    // Output: estimated distance for each sensor.

    const sendMeasurementRequest = async () => {

        const sensorsArray = [task.optionalSensors, ...task.requiredSensors].flat();

        try {
            const measurements = await Promise.all(sensorsArray.map(async (sensor) => {
                let measurement = { sensor };
                try {
                    const response = await axios.post('http://localhost:5000/api/calc/distance', {
                        position: consoleProps.position,
                        direction: consoleProps.angle,
                        sensor: sensor,
                        inputObject: inputObject.points
                    });
                    measurement.distance = response.data;
                } catch (error) {
                    console.log(error);
                }
                return measurement;
            }));

            dispatch(addMeasurement(measurements)).then(() => {
                console.log('Measurements added to Redux store:', measurementsArray);
            });
            return measurements;

        } catch (error) {
            console.log('Error in sendMeasurementRequest:', error);
            return null;
        }
    };

    return (
        <ConsoleContext.Provider value={{ consoleProps, setConsoleProps }}> 
            <InputObjectContext.Provider value={{ inputObject, setInputObject }}>
                <Grid container className="chart-item-container">
                    <Grid item xs={12} sm={12} md={6} >
                        <Stack spacing={2}>
                            <Typography variant="h6" className="task-item-title">{task.name}</Typography>
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
                                            size="small"
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
                                <StyledButton
                                    name="Measure"
                                    onClick={sendMeasurementRequest}
                                />
                                <IconButton className="icon-button">
                                    <HiOutlineArrowUturnLeft />
                                </IconButton>
                                <IconButton className="icon-button">
                                    <HiOutlineArrowUturnRight />
                                </IconButton>
                                <IconButton className="icon-button">
                                    <HiOutlineSave />
                                </IconButton>
                                {
                                    chartProps.movementRequired ?
                                    <>
                                        <TextField 
                                            className="select" 
                                            label="Position X"
                                            type="number"
                                            size="small"
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
                                            size="small"
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