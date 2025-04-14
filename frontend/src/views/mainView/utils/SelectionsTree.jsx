// * React and Redux:
import React from 'react';
import { useSelector } from 'react-redux';

// * MUI and styles:
import {
    Grid, 
    Stack,
    Divider,
    Typography
} from '@mui/material';
import { 
    SimpleTreeView, 
    TreeItem 
} from '@mui/x-tree-view';

// * Utils:
import { v4 as uuidv4 } from 'uuid';
import taskNameGenerator from '../../../services/utils/taskNameGenerator';

const SelectionsTree = () => {

    const selections = useSelector((state) => state.selections.selectionsArray);
    const deviceType = useSelector((state) => state.deviceType.deviceType);

    return (
        <Grid item xs={12} md={12} lg={2.5} className="selections-tree-container">
            <SimpleTreeView>
                <TreeItem itemId="grid" label="Charts tree">
                    {
                        selections
                            .filter((selection) => selection.confirmed)
                            .map((selection, index) => (
                                <React.Fragment key={index}>
                                    <TreeItem 
                                        label={selection.name} 
                                        itemId={`grid-community-${uuidv4()}`} 
                                        onClick={() => {
                                            const taskName = taskNameGenerator(selection.name);
                                            window.scrollTo(document.getElementById(taskName).offsetLeft, document.getElementById(taskName).offsetTop);
                                        }}
                                    >
                                    {
                                        selection.inputObjects && selection.inputObjects.length > 0 &&
                                        <Typography variant="subtitle1" className="text-secondary">Input object</Typography>
                                    }
                                    {
                                        selection.inputObjects && selection.inputObjects.map((object, index) => (
                                            <TreeItem
                                                key={index} 
                                                label={object.name} 
                                                itemId={`grid-community-sub-${uuidv4()}`} 
                                                onClick={() => {
                                                    const taskName = taskNameGenerator(selection.name);
                                                    window.scrollTo(document.getElementById(taskName).offsetLeft, document.getElementById(taskName).offsetTop);
                                                }}
                                            />
                                        ))
                                    }
                                    </TreeItem>
                                    {
                                        index < selections.filter((selection) => selection.confirmed).length - 1 && 
                                        <Divider style={{ margin: 'calc(var(--padding) / 2) 0' }} />
                                    }
                                </React.Fragment>
                            )
                        )
                    }
                </TreeItem>     
            </SimpleTreeView>
        </Grid>
    )
}

export default SelectionsTree;