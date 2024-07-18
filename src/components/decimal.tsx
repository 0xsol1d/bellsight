import React from 'react';

interface DecimalProps {
    number: number;
    dec: number
}

export const Decimal: React.FC<DecimalProps> = ({ number, dec }) => {
    const hasDecimals = number % 1 !== 0;
    const outputValue = hasDecimals ? number.toLocaleString(undefined, { minimumFractionDigits: dec }) : number.toFixed(0);

    return (
        <>{outputValue}</>
    );
};
