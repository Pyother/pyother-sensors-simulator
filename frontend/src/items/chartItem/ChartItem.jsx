// * React and Redux:
import React, { 
    useState, 
    useEffect, 
    useContext, 
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
} from '@mui/material';

// * Own items:
import Chart from './Chart';
import Console from './Console';

// * Styles:
import './chartItem.css';

export const PostionContext = createContext();

const ChartItem = ({ task }) => {

    const config = useSelector((state) => state.config);
    const inputObjects = useSelector((state) => state.inputObjects.objectsArray);
    const [chartProps, setChartProps] = useState({});
    const [inputObject, setInputObject] = useState({ name: "", points: [] });
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const itemFromConfig = config.tasks.find((item) => item.name === task.name);
        setChartProps({
            name: itemFromConfig.name,
            description: itemFromConfig.description,
            inputObjectRequired: itemFromConfig.inputObjectRequired,
            movementRequired: itemFromConfig.movementRequired
        });
    }, [config, task]);

    return (
        <Grid 
            item xs={12} sm={12} md={6} 
            className="chart-item-container"
        >   
            <PostionContext.Provider value={{ position, setPosition }}> 
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
                    {
                        chartProps.movementRequired ? (
                            <div className="center">
                                <Console />
                            </div>
                        ) : null
                    }
                </Stack>
            </PostionContext.Provider>
        </Grid>
    )
}

export default ChartItem;