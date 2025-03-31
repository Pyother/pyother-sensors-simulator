// * React:
import React from 'react';

// * MUI:
import {
    Button
} from '@mui/material';

const StyledButton = ({ name, onClick }) => {
    return (
        <Button
            className="button"
            onClick={onClick}
        >
            {name}
        </Button>
    )
}

export default StyledButton;