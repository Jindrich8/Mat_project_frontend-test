import { Group } from "@mantine/core";
import { DateTimePicker, DateValue } from "@mantine/dates";
import React, { FC } from "react"
import { BasicStyledCmpProps } from "../../types/props/props";

interface Props extends BasicStyledCmpProps {
fromLabel?:string,
toLabel?:string,
defaultFromValue?:DateValue,
defaultToValue?:DateValue,
fromValue?:DateValue,
toValue?:DateValue,
onChange?:(type:'from'|'to',value:DateValue) => void
}

const DateTimeRangeInputCmp:FC<Props> = ({
    fromValue,
    defaultFromValue,
    toValue,
    defaultToValue,
    onChange,
    fromLabel,
    toLabel,
    ...base
}) => {

    const onFromChange = React.useCallback((value:DateValue) => {
        onChange && onChange('from', value);
    },[onChange]);

    const onToChange = React.useCallback((value:DateValue) => {
        onChange && onChange('to', value);
    },[onChange]);

  return (
    <Group w={'100%'} justify={'center'} {...base}>
        <DateTimePicker
        clearable
        label={fromLabel}
        defaultValue={defaultFromValue}
        value={fromValue}
        onChange={onFromChange}
        />
        {' - '}
        <DateTimePicker
        clearable
        label={toLabel}
        defaultValue={defaultToValue}
        value={toValue}
        onChange={onToChange}
         />
    </Group>
  );
};

export { DateTimeRangeInputCmp, type Props as DateTimeRangeInputCmpProps };
