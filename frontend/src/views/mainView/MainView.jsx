// * React and Redux:
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// * MUI and Styled Components:
import { 
    Grid,
    Stack, 
    IconButton,
    ThemeProvider,
    Dialog, 
    DialogTitle
} from '@mui/material';
import StyledButton from '../../components/styledComponents/StyledButton';
import Section from '../../components/section/Section';
import { BsFiletypeCsv } from "react-icons/bs";

// * Items:
import ChartItem from '../../items/chartItem/ChartItem';

// * Styles:
import './mainView.css';
import colorsTheme from '../../assets/themes/colorsTheme';

// * Utils:
import InputObjectGenerator from './utils/InputObjectGenerator';
import InputObjectsTable from './utils/InputObjectsTable';
import SelectionsTree from './utils/SelectionsTree';


const MainView = () => {

    const selections = useSelector((state) => state.selections.selectionsArray);
    const inputObjectsArray = useSelector((state) => state.inputObjects.objectsArray);
    const deviceType = useSelector((state) => state.deviceType.deviceType);
    
    const [openDialog, setOpenDialog] = useState(false);

    return (
        <ThemeProvider theme={colorsTheme}>
            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
            >
                <InputObjectGenerator />
            </Dialog>
            <Stack spacing={2} className="main-view-container">

                {/* 
                    // * Section 1
                    // Input objects table 
                */}
                <Section 
                    title="Input objects"
                    children={<InputObjectsTable />}
                />

                {/* 
                    // * Temp
                */}
                <Stack direction="row" spacing={2}>
                    <StyledButton 
                        name="New object"
                        onClick={() => setOpenDialog(true)}
                    />
                    <IconButton className="icon-button" disabled>
                        <BsFiletypeCsv className="icon" />
                    </IconButton>
                </Stack>

                {/* 
                    // * Section 2
                    // Listing of the tasks with selections tree
                */}
                <Section 
                    title="Tasks"
                    children={
                        <Grid container>
                            <SelectionsTree />
                            <Grid item xs={12} md={12} lg={9.5} className="no-padding">
                                {selections
                                    .filter((selection) => selection.confirmed)
                                    .map((selection, index) => (
                                        <ChartItem key={index} task={selection} />
                                    ))
                                }
                            </Grid>
                        </Grid>
                    }
                />
            </Stack>
        </ThemeProvider>
    )
}

export default MainView;