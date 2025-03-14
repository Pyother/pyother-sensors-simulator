import React, { useState, useEffect, useContext } from 'react';
import { ConsoleContext } from './ChartItem';

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

const Console = ({ movement, angleRegulation }) => {

    const { consoleProps, setConsoleProps } = useContext(ConsoleContext);
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

    const changePosition = (direction) => {
        const { x, y } = consoleProps.position;
        const movementStep = consoleProps.movementStep;

        switch (direction) {
            case 'up':
                if (consoleProps.position.y + movementStep > 500) return;
                else setConsoleProps({ ...consoleProps, position: { x, y: y + movementStep } });
                break;
            case 'down':
                if (consoleProps.position.y - movementStep < -500) return;
                else setConsoleProps({ ...consoleProps, position: { x, y: y - movementStep } });
                break;
            case 'left':
                if (consoleProps.position.x - movementStep < -500) return;
                else setConsoleProps({ ...consoleProps, position: { x: x - movementStep, y } });
                break;
            case 'right':
                if (consoleProps.position.x + movementStep > 500) return;
                else setConsoleProps({ ...consoleProps, position: { x: x + movementStep, y } });
                break;
            default:
                break;
        }
    }

    const regulateAngle = (angle) => {
        setConsoleProps({ ...consoleProps, angle });
    }

    const changeMovementStep = (step) => {
        setConsoleProps({ ...consoleProps, movementStep: step });
    }

    return (
        <Stack spacing={2} className="center full-width">
            <Stack className="console-container center" spacing={1}>
                <Stack direction="row" spacing={2}>
                    <div className="console-cell"></div>
                    <div className="console-cell">
                        <IconButton
                            onClick={() => changePosition('up')}
                        >
                            <HiArrowUp />
                        </IconButton>
                    </div>
                    <div className="console-cell"></div>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <div className="console-cell">
                        <IconButton
                            onClick={() => changePosition('left')}
                        >
                            <HiArrowLeft />
                        </IconButton>
                    </div>
                    <div className="console-cell"></div>
                    <div className="console-cell">
                        <IconButton
                            onClick={() => changePosition('right')}
                        >
                            <HiArrowRight />
                        </IconButton>
                    </div>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <div className="console-cell"></div>
                    <div className="console-cell">
                        <IconButton
                            onClick={() => changePosition('down')}
                        >
                            <HiArrowDown />
                        </IconButton>
                    </div>
                    <div className="console-cell"></div>
                </Stack>
            </Stack>
            <Stack direction="row" spacing={8} className="full-width" style={{display: 'flex', justifyContent: 'center'}}>
                {
                    movement ?
                        <Stack>
                            <p className="text-secondary">Movement step</p>
                            <Slider
                                min={0.1}
                                max={50}
                                step={0.1}
                                defaultValue={10}
                                size="small"
                                aria-label="Movement step"
                                valueLabelDisplay="auto"
                                getAriaValueText={(value) => valuetext(value, "movementStep")}
                                marks={movementSliderMarks}
                                onChange={(e, value) => changeMovementStep(value)}
                                style={{marginBottom: '3em'}}
                            />
                        </Stack> : null
                }
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
                                onChange={(e, value) => regulateAngle(value)}
                                style={{marginBottom: '3em'}}
                            />
                        </Stack> : null
                }
            </Stack>
        </Stack>
    );
}

export default Console;