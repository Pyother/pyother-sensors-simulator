import React, { useState, useContext } from 'react';
import { PositionContext } from './ChartItem';

// * MUI:
import {
    Stack,
    Slider,
    IconButton
} from '@mui/material';

// * Icons:
import { HiArrowUp } from "react-icons/hi";
import { HiArrowDown } from "react-icons/hi";
import { HiArrowLeft } from "react-icons/hi";
import { HiArrowRight } from "react-icons/hi";

// * Styles:
import './chartItem.css';

const Console = ({ angleRegulation }) => {

    //const { position, setPosition } = useContext(PositionContext);
    const [movementStep, setMovementStep] = useState(10);

    const valuetext = (value, sliderType) => {
        if(sliderType === 'movementStep') return `${value} cm`;
        if(sliderType === 'angle') return `${value}°`;
    }

    const movementSliderMarks = [
        {
            value: 0.1,
            label: '0.1 cm',
        },
        {
            value: 50,
            label: '50 cm',
        }
    ];

    const angleSliderMarks = [
        {
            value: -180,
            label: '-180°',
        },
        {
            value: 0,
            label: '0°',
        },
        {
            value: 180,
            label: '180°',
        }
    ];

    return (
        <Stack spacing={2} className="center full-width">
            <Stack className="console-container center" spacing={1}>
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
            <Stack direction="row" spacing={8} className="full-width" style={{display: 'flex', justifyContent: 'center'}}>
                <Stack >
                    <p className="text-secondary">Movement step</p>
                    <Slider
                        min={0.1}
                        max={50}
                        step={0.1}
                        defaultValue={10}
                        onChange={(e, value) => setMovementStep(value)}
                        size="small"
                        aria-label="Movement step"
                        valueLabelDisplay="auto"
                        getAriaValueText={(value) => valuetext(value, "movementStep")}
                        marks={movementSliderMarks}
                        style={{ marginBottom: '2em' }}
                    />
                </Stack>
                {
                    angleRegulation ?
                        <Stack >
                            <p className="text-secondary">Sensor's direction</p>
                            <Slider
                                min={-180}
                                max={180}
                                step={1}
                                defaultValue={0}
                                size="small"
                                aria-label="Angle regulation"
                                valueLabelDisplay="auto"
                                getAriaValueText={(value) => valuetext(value, "angle")}
                                marks={angleSliderMarks}
                            />
                        </Stack> : null
                }
            </Stack>
        </Stack>
    );
}

export default Console;