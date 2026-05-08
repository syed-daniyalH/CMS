import React, {useState, useEffect, useRef} from 'react';
import {Autocomplete} from '@mui/material';
import CustomTextField from "../components/mui/text-field";

interface Props {
  data: string[]
  setRowHeight?: (value: number) => void
  handleChange: (value: string[]) => void
  disabled?: boolean
  noBorder?: boolean
}

const SerialDropdownSelector = ({data, disabled = false, noBorder = true, setRowHeight, handleChange}: Props) => {
  const [options, _setOptions] = useState<string[]>([]);
  const [value, setValue] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const autoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const newHeight = entry.contentRect.height + 16; // padding buffer
        // ✅ Update DataGrid row height
        if(!!setRowHeight) {
          setRowHeight(newHeight);
        }
      }
    });

    if (autoRef.current) observer.observe(autoRef.current);
    return () => observer.disconnect();
  }, [autoRef]);

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && inputValue) {
      event.preventDefault();
      const newValues = inputValue
        .split(',')
        .map(val => val.trim())
        .filter(val => val.length > 0 && !value.includes(val));

      if (newValues.length > 0) {
        setValue([...value, ...newValues]);
      }
      setInputValue('');
    }
  };

  useEffect(() => {
    let isActive = true;

    if (isActive) {
      setValue(data);
    }


    return () => {
      isActive = false;
    }
  }, [data])

  const customOptions = inputValue && !options.includes(inputValue)
    ? [...options, inputValue]
    : options;

  return (
    <div ref={autoRef} style={{width: '100%'}}>
      <Autocomplete
        multiple
        freeSolo
        fullWidth
        options={customOptions}
        value={value}
        inputValue={inputValue}
        onInputChange={(_e, newInputValue) => setInputValue(newInputValue)}
        onChange={(_event, newValueRaw) => {
          let newValue: string[];

          const lastItem = newValueRaw[newValueRaw.length - 1];

          // If the last added item is comma separated, split it
          if (typeof lastItem === 'string' && lastItem.includes(',')) {
            const splitItems = lastItem
              .split(',')
              .map((item) => item.trim())
              .filter((item) => item.length > 0 && !value.includes(item));

            newValue = [...newValueRaw.slice(0, -1), ...splitItems];
          } else {
            newValue = newValueRaw;
          }

          setValue(newValue);
          setInputValue('');
          handleChange(newValue); // your callback
        }}
        filterSelectedOptions
        disabled={disabled ?? false}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            fullWidth
            autoFocus
            placeholder="Add Serials"
            onKeyDown={handleKeyDown}
            noBorder={noBorder}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </div>
  );
};

export default SerialDropdownSelector;
