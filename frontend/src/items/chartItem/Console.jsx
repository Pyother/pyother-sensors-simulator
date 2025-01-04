import React, { useContext } from 'react';
import { PositionContext } from './ChartItem';

// * MUI:
import {
    Stack,
    IconButton
} from '@mui/material';

// * Icons:
import { HiArrowUp } from "react-icons/hi";
import { HiArrowDown } from "react-icons/hi";
import { HiArrowLeft } from "react-icons/hi";
import { HiArrowRight } from "react-icons/hi";

// * Styles:
import './chartItem.css';

const Console = () => {

    const { position, setPosition } = useContext(PositionContext);

    return (
        <Stack className="console-container">
            <Stack direction="row" spacing={2}>
                <div className="console-cell"></div>
                <div className="console-cell">
                    <IconButton>
                        <HiArrowUp />
                    </IconButton>
                </div>
                <div className="console-cell"></div>
            </Stack>
            <Stack direction="row" spacing={2}>
                <div className="console-cell">
                    <IconButton>
                        <HiArrowLeft />
                    </IconButton>
                </div>
                <div className="console-cell"></div>
                <div className="console-cell">
                    <IconButton>
                        <HiArrowRight />
                    </IconButton>
                </div>
            </Stack>
            <Stack direction="row" spacing={2}>
                <div className="console-cell"></div>
                <div className="console-cell">
                    <IconButton>
                        <HiArrowDown />
                    </IconButton>
                </div>
                <div className="console-cell"></div>
            </Stack>
        </Stack>
    );
}

export default Console;