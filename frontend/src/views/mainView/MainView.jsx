// * React and Redux:
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeObject } from '../../features/data/InputObjectsSlice';

// * MUI and Styled Components:
import { 
    Grid,
    Stack, 
    Button,
    Typography,
    ThemeProvider,
    Dialog, 
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import StyledButton from '../../components/styledComponents/StyledButton';

// * Items:
import ChartItem from '../../items/chartItem/ChartItem';

// * Generator:
import InputObjectGenerator from './InputObjectGenerator';

// * Styles:
import './mainView.css';
import colorsTheme from '../../assets/themes/colorsTheme';

const MainView = () => {

    const dispatch = useDispatch();
    const selections = useSelector((state) => state.selections.selectionsArray);
    const inputObjectsArray = useSelector((state) => state.inputObjects.objectsArray);
    
    const [openDialog, setOpenDialog] = useState(false);

    /*
    useEffect(() => {
        console.log(selections);
    }, []);
    */

    return (
        <ThemeProvider theme={colorsTheme}>
            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
            >
                <InputObjectGenerator />
            </Dialog>
            <Stack spacing={2} className="main-view-container">
                <Typography variant="h6">Input Objects</Typography>
                {
                    inputObjectsArray.length > 0 ? 
                    <TableContainer className="table-container">
                        <Table>
                            <TableHead className="table-head-container">
                                <TableRow>
                                    <TableCell>Object name</TableCell>
                                    <TableCell>Numer of points</TableCell>
                                    <TableCell>Closed geometry</TableCell>
                                    <TableCell>Mean distance beetwen points [m]</TableCell>
                                    <TableCell>Remove</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {inputObjectsArray.map((object, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{object.name}</TableCell>
                                        <TableCell>{object.points.length}</TableCell>
                                        <TableCell>
                                            {
                                                object.points.filter((point, idx, arr) => 
                                                    arr.some((p, i) => i !== idx && p.x === point.x && p.y === point.y)
                                                ).length > 0 ? 'Yes' : 'No'
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {
                                                object.points.length > 1 ? 
                                                (object.points.reduce((acc, point, index) => {
                                                    if(index === 0) return acc;
                                                    return acc + Math.sqrt(
                                                        (point.x - object.points[index - 1].x) ** 2 + 
                                                        (point.y - object.points[index - 1].y) ** 2
                                                    );
                                                }, 0) / (object.points.length - 1)).toFixed(2) : 0
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <StyledButton 
                                                name="Remove"
                                                onClick={() => dispatch(removeObject(object))}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                     : 
                    <p className="text-secondary">No input objects</p>
                }
                <Stack direction="row" spacing={2}>
                    <StyledButton 
                        name="New object"
                        onClick={() => setOpenDialog(true)}
                    />
                </Stack>
                <Typography variant="h6">Charts</Typography>
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