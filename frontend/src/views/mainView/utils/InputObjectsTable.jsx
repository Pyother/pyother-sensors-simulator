// * React and Redux:
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeObject } from '../../../features/data/InputObjectsSlice';

// MUI: 
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow 
} from '@mui/material';
import StyledButton from '../../../components/styledComponents/StyledButton';

const InputObjectsTable = () => {

    const inputObjectsArray = useSelector((state) => state.inputObjects.objectsArray);

    return (
        <>
        {
            inputObjectsArray && inputObjectsArray.length > 0 ?
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
            </TableContainer> : <p>No declared objects</p>
        } 
        </>
    )
}

export default InputObjectsTable;