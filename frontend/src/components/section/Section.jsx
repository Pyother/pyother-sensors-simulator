// * React:
import React from 'react';

// * UI and styles:
import {
    Stack,
    Typography
} from '@mui/material';
import './section.css';

const Section = ({ children, title }) => {
    return (
        <Stack spacing={2} className="section-container">
            <Typography variant="h5" className="section-title">{title}</Typography>
            {children}
        </Stack>
    )
}

export default Section;