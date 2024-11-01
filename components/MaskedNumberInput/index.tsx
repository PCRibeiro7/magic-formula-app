import { TextField } from "@mui/material";
import { NumericFormat } from 'react-number-format';
import React from "react";

interface Props {
    value: string;
    handleChange: (e: { target: { value: string } }) => void;
    placeholder: string;
}

export default function MaskedNumberInput({
    value,
    handleChange,
    placeholder,
}: Props) {
    return (
        <NumericFormat
            thousandSeparator={"."}
            decimalSeparator={","}
            prefix="R$"
            value={value}
            customInput={TextField}
            onValueChange={({ value: v }) =>
                handleChange({ target: { value: v } })
            }
            placeholder={placeholder}
        />
    );
}
