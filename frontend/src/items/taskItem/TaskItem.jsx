// * React and Redux:
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSelection } from '../../features/data/SelectionsSlice';

// * MUI:
import {
    Grid,
    Stack,
    Select,
    Typography,
    FormControl,
    MenuItem,
    InputLabel,
    ThemeProvider,
    Button
} from '@mui/material';

// * React icons:
import { MdDone } from "react-icons/md";

// * Styles:
import './taskItem.css';
import colorsTheme from '../../assets/themes/colorsTheme';

const TaskItem = ({ task }) => {

    const dispatch = useDispatch();
    const config = useSelector((state) => state.config);
    const selections = useSelector((state) => state.selections.selectionsArray);

    const [taskAdded, setTaskAdded] = useState(false);
    const [displayConfirmation, setDisplayConfirmation] = useState(false);
    const [requiredSensorsArray, setRequiredSensorsArray] = useState([]);
    const [optionalSensorsArray, setOptionalSensorsArray] = useState([]);

    const handleConfirmTask = () => {
        const taskToUpdate = {
            name: task.name,
            confirmed: true,
            requiredSensors: requiredSensorsArray,
            optionalSensors: optionalSensorsArray
        };
        dispatch(updateSelection(taskToUpdate));
        console.log(selections);
    };

    return (
        <Grid item xs={12} sm={4} md={3} className="task-item-container">
            <ThemeProvider theme={colorsTheme}>
            {
                !taskAdded ? 
                <Stack spacing={2}>
                    <Typography 
                        variant="body1"
                        className="task-item-title"
                    >
                        {task.name}
                    </Typography>
                    <p className="text-secondary">(Place for description)</p>
                    <FormControl fullWidth>
                        <InputLabel>Required sensors (select at least one)</InputLabel>
                        <Select
                            label="Required sensors (select at least one)"
                            multiple
                            value={requiredSensorsArray}
                            onChange={(event) => setRequiredSensorsArray([...event.target.value])}
                        >
                            {config.sensors.map((sensor, index) => (
                                <MenuItem key={index} value={sensor.name}>{sensor.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {
                        task.sensorTypesOptional.length > 0 ? 
                        <FormControl fullWidth>
                            <InputLabel>Optional sensors</InputLabel>
                            <Select
                                label="Optional sensors"
                                multiple
                                value={optionalSensorsArray}
                                onChange={(event) => setOptionalSensorsArray([...event.target.value])}
                            >
                                {config.sensors.map((sensor, index) => (
                                    <MenuItem key={index} value={sensor.name}>{sensor.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl> : null
                    }
                    <Button 
                        disabled={requiredSensorsArray.length === 0}
                        variant="contained" 
                        className="task-item-button"
                        onClick={() => { 
                            setTaskAdded(true);
                            setDisplayConfirmation(true); 
                            handleConfirmTask();
                        }}
                    >
                        Confirm task
                    </Button>
                </Stack> : 
                <>
                {
                    displayConfirmation ?
                    <>
                        <Typography 
                            variant="body1"
                            className="task-item-title"
                        >
                            {task.name}
                        </Typography>
                        <Stack spacing={2} className="center confirmation-container">
                            <MdDone className="icon-success" style={{fontSize: 'xx-large', color: 'green'}}/>
                            <p className="text-secondary">Task succesfully added!</p>
                        </Stack>
                    </> : null
                }
                </>
            }
            </ThemeProvider>
        </Grid>
    );
}

export default TaskItem;