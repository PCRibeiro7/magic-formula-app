import { TextField } from "@mui/material";
import NumberFormat from "react-number-format";
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
        <NumberFormat
            thousandSeparator={"."}
            decimalSeparator={","}
            isNumericString
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
