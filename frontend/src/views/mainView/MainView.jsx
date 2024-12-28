// * React and Redux:
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// * MUI:
import { 
    Grid,
    Stack, 
    Button,
    Typography,
    ThemeProvider,
    Dialog, 
    DialogTitle,
} from '@mui/material';

// * Items:
import ChartItem from '../../items/chartItem/ChartItem';

// * Generator:
import InputObjectGenerator from './InputObjectGenerator';

// * Styles:
import './mainView.css';
import colorsTheme from '../../assets/themes/colorsTheme';

const MainView = () => {

    const selections = useSelector((state) => state.selections.selectionsArray);
    
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        console.log(selections);
    }, []);

    return (
        <ThemeProvider theme={colorsTheme}>
            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
            >
                <InputObjectGenerator />
            </Dialog>
            <Stack spacing={2} className="main-view-container">
                <Stack direction="row" spacing={2}>
                    <Button 
                        variant="contained" 
                        onClick={() => setOpenDialog(true)}
                    >
                        Input object generator
                    </Button>
                </Stack>
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
        </ThemeProvider>
    )
}

export default MainView;