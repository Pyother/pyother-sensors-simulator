// * React and Redux:
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeObject } from '../../features/data/InputObjectsSlice';

// * MUI and Styled Components:
import { 
    Grid,
    Stack, 
    Button,
    IconButton,
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
    Divider
} from '@mui/material';
import StyledButton from '../../components/styledComponents/StyledButton';
import { 
    SimpleTreeView, 
    TreeItem 
} from '@mui/x-tree-view';
import { BsFiletypeCsv } from "react-icons/bs";

// * Items:
import ChartItem from '../../items/chartItem/ChartItem';

// * Generator:
import InputObjectGenerator from './InputObjectGenerator';

// * Styles:
import './mainView.css';
import colorsTheme from '../../assets/themes/colorsTheme';

// * Utils:
import taskNameGenerator from '../../services/utils/taskNameGenerator';


const MainView = () => {

    const dispatch = useDispatch();
    const selections = useSelector((state) => state.selections.selectionsArray);
    const inputObjectsArray = useSelector((state) => state.inputObjects.objectsArray);
    const deviceType = useSelector((state) => state.deviceType.deviceType);
    
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
                                    <TableRow key={index} hover>
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
                    <IconButton className="icon-button" disabled>
                        <BsFiletypeCsv className="icon" />
                    </IconButton>
                </Stack>
                <Typography variant="h6">Charts</Typography>
                <Grid container spacing={2}>
                    {
                        (deviceType === 'desktop' || deviceType === 'small-desktop') &&
                        <Grid 
                            item 
                            xs={0} 
                            md={0} 
                            lg={2.5} 
                            style={{ 
                                padding: 0, 
                                height: '100%', 
                                position: 'sticky', 
                                top: 0, 
                                alignSelf: 'flex-start',
                                paddingRight: deviceType === 'desktop' || deviceType === 'small-desktop' ? 
                                    'var(--padding)' : 0,
                            }}
                        >

                            <SimpleTreeView>
                                <TreeItem itemId="grid" label="Charts tree">
                                {
                                    selections
                                        .filter((selection) => selection.confirmed)
                                        .map((selection, index) => (
                                            <TreeItem 
                                                key={index} 
                                                label={selection.name} 
                                                itemId={`grid-community-${index}`} 
                                                getItemId={() => `grid-community-${index}`} 
                                                onClick={() => {
                                                    const taskName = taskNameGenerator(selection.name);
                                                    window.scrollTo(document.getElementById(taskName).offsetLeft, document.getElementById(taskName).offsetTop);
                                                }}
                                            >
                                                {
                                                    selection.inputObjects && selection.inputObjects.map((object, index) => (
                                                        <TreeItem
                                                            key={index} 
                                                            label={object.name} 
                                                            itemId={`grid-community-sub-${index}`} 
                                                            getItemId={() => `grid-community-sub-${index}`} 
                                                            onClick={() => {
                                                                const taskName = taskNameGenerator(selection.name);
                                                                window.scrollTo(document.getElementById(taskName).offsetLeft, document.getElementById(taskName).offsetTop);
                                                            }}
                                                        />
                                                        )
                                                    )
                                                }
                                            </TreeItem>
                                        ))
                                }
                                </TreeItem>     
                            </SimpleTreeView>
                        </Grid>
                    }
                    <Grid 
                        item 
                        xs={12} 
                        md={12}
                        lg={9.5}
                        style={{ padding: 0 }}
                    >
                        {selections
                            .filter((selection) => selection.confirmed)
                            .map((selection, index) => (
                                <ChartItem key={index} task={selection} />
                            ))
                        }
                    </Grid>
                </Grid>
            </Stack>
        </ThemeProvider>
    )
}

export default MainView;