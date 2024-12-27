// * React and Redux:
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSelection, removeSelection } from '../../features/data/SelectionsSlice';

// * MUI:
import {
    Grid,
    Typography,
    Stack,
    Select,
    InputLabel,
    FormControl,
    MenuItem,
    Chip,
    OutlinedInput,
    Button,
    Box
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

// * Items:
import TaskItem from '../../items/taskItem/TaskItem';

// * Styles:
import './configurationView.css';
import colorsTheme from '../../assets/themes/colorsTheme';

const ConfigurationView = () => {
    const dispatch = useDispatch();

    const config = useSelector((state) => state.config);
    const selections = useSelector((state) => state.selections.selectionsArray);

    const handleSelectChange = (event) => {

        const { value } = event.target;
        const tasksToAdd = typeof value === 'string' ? value.split(',') : value;

        tasksToAdd.forEach((task) => {
            if (!selections.find((selection) => selection.name === task)) {
                const taskToAdd = {
                    name: task,
                    confirmed: false,
                    requiredSensors: [],
                    optionalSensors: []
                };
                dispatch(addSelection(taskToAdd));
            }
        });

        selections.forEach((selection) => {
            if (!tasksToAdd.includes(selection.name)) {
                dispatch(removeSelection(selection.name));
            }
        });
    };

    return (
        <ThemeProvider theme={colorsTheme}>
            <Stack spacing={2} sx={{ p: 2 }} className="center configuration-container">
                <FormControl style={{ minWidth: '25%' }}>
                    <InputLabel id="tasks-select-label">Available tasks</InputLabel>
                    <Select
                        className="select"
                        fullWidth
                        multiple
                        value={selections.map((selection) => selection.name)}
                        onChange={handleSelectChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Available tasks" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                    >
                        {config.tasks.map((task, index) => (
                            <MenuItem key={index} value={task.name}>
                                {task.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {selections.length > 0 && (
                    <Stack spacing={2} className="full-width">
                        <Typography variant="h6" className="full-width">Selected tasks</Typography>
                        <Grid container>
                            {selections
                                .map((selection, index) => {
                                    const taskData = config.tasks.find((t) => t.name === selection.name);
                                    if (!taskData) return null;
                                    return <TaskItem key={index} task={taskData} />;
                                })}
                        </Grid>
                    </Stack>
                )}
                {selections.length > 0 && selections.some((selector) => selector.confirmed) && (
                    <Stack className="full-width" spacing={2}>
                        <Typography variant="h6">Confirm choices</Typography>
                        <Stack direction="row" spacing={2} >
                            {selections
                                .filter((selector) => selector.confirmed)
                                .map((selector, index) => (
                                    <Chip key={index} label={selector.name} />
                                ))
                            }
                        </Stack>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{width: 'fit-content'}}
                            onClick={() => console.log('Confirm')}
                        >
                            Confirm and go to dashboard
                        </Button>
                    </Stack>
                )}
            </Stack>
        </ThemeProvider>
    );
};

export default ConfigurationView;
