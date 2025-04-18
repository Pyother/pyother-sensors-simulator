// * React:
import React from 'react';

// * MUI:
import {
    Button
} from '@mui/material';

const StyledButton = ({ name, onClick, disabled }) => {
    return (
        <Button
            disabled={disabled}
            className={disabled ? 'button disabled' : 'button'}
            onClick={onClick}
        >
            {name}
        </Button>
    )
}

export default StyledButton;