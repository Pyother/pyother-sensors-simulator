// * React and Redux:
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

// * MUI:
import {
    Typography,
    Stack,
    Select,
    InputLabel,
    FormControl,
    Button,
    MenuItem,
    Chip,
    OutlinedInput,
    Box
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { IoMdMenu } from "react-icons/io";

// * Styles:
import './configurationView.css';
import colorsTheme from '../../assets/themes/colorsTheme';

const ConfigurationView = () => {

    const config = useSelector((state) => state.config);
    const [selectedTasks, setSelectedTasks] = useState([]);

    const handleSelectChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedTasks(typeof value === 'string' ? value.split(',') : value);
    };

    return (
        <ThemeProvider theme={colorsTheme}>
            <Stack spacing={2} sx={{ p: 2 }} className="center configuration-container">
                <FormControl className="full-width">
                    <InputLabel id="tasks-select-label">Available tasks</InputLabel>
                    <Select
                        className="select"
                        fullWidth
                        multiple
                        value={selectedTasks}
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
                {
                    selectedTasks.length > 0 &&
                    <Stack spacing={2} className="full-width">
                        <Typography variant="h6" className="full-width">Selected tasks</Typography>
                        <Stack spacing={1} className="full-width">
                            {selectedTasks.map((task, index) => (
                                <Stack key={index} spacing={1} className="full-width">
                                    <Typography variant="body1">{task}</Typography>
                                    <Stack spacing={1} direction="row" className="full-width">
                                        <Button variant="contained" color="primary">Edit</Button>
                                        <Button variant="contained" color="secondary">Delete</Button>
                                    </Stack>
                                </Stack>
                            ))}
                        </Stack>
                    </Stack>
                }
            </Stack>
        </ThemeProvider>
    );
};

export default ConfigurationView;
