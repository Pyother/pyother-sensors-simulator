// * React and Redux:
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// * MUI:
import { 
    Grid,
    Stack, 
    Typography,
} from '@mui/material';

// * Items:
import ChartItem from '../../items/chartItem/ChartItem';

// * Styles:
import './mainView.css';

const MainView = () => {

    const selections = useSelector((state) => state.selections.selectionsArray);

    useEffect(() => {
        console.log(selections);
    }, []);

    return (
        <Stack spacing={2} className="main-view-container">
            <Typography variant="h6">Wykresy</Typography>
            <Grid container spacing={2}>
                {selections
                    .filter((selection) => selection.confirmed)
                    .map((selection, index) => (
                        <ChartItem key={index} task={selection} />
                    ))
                }
            </Grid>
        </Stack>
    )
}

export default MainView;