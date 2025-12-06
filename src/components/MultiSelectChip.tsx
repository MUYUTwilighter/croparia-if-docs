import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

export interface MultiSelectChipProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function MultiSelectChip({
                                          label,
                                          options,
                                          value,
                                          onChange,
                                          placeholder,
                                          disabled,
                                        }: MultiSelectChipProps) {
  return (
    <Autocomplete<string, true, false, false>
      multiple
      disableCloseOnSelect
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      renderValue={(selected, getItemProps) =>
        selected.map((option, index) => {
          const {key, ...chipProps} = getItemProps({index});
          return (
            <Chip
              key={key}
              {...chipProps}
              label={option}
              size="small"
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          size="small"
        />
      )}
      disabled={disabled}
    />
  );
}