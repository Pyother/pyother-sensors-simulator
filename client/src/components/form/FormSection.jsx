import React from 'react';

const FormSection = ({ title, children }) => {
    return (
        <>
            {title && <p className="text-sm">{title}</p>}
            {children}
        </>
    );
};

export default FormSection;
