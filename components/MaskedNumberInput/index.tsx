import { TextField } from "@mui/material";
import NumberFormat from "react-number-format";
import React from "react";

export default function MaskedNumberInput({
    value,
    handleChange,
    placeholder,
}) {
    return (
        <NumberFormat
            thousandSeparator={"."}
            decimalSeparator={","}
            isNumericString
            prefix="R$"
            value={value}
            customInput={TextField}
            onValueChange={({ value: v }) =>
                handleChange({ target: { name, value: v } })
            }
            placeholder={placeholder}
        />
    );
}
