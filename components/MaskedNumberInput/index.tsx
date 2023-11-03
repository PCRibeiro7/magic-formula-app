import { TextField } from "@mui/material";
import NumberFormat from "react-number-format";
import React from "react";

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
    { onChange, name, ...other }: any,
    ref
) {
    return (
        <NumberFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator={"."}
            decimalSeparator={","}
            isNumericString
            prefix="R$"
        />
    );
});

export default function MaskedNumberInput({
    value,
    handleChange,
    placeholder,
}) {
    return (
        <TextField
            value={value}
            onChange={handleChange}
            InputProps={{
                inputComponent: NumberFormatCustom,
            }}
            placeholder={placeholder}
        />
    );
}
