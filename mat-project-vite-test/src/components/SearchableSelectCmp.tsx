/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react"
import { BasicStyledCmpProps } from "../types/props/props";
import { Box, ComboboxItem, OptionsFilter, Select } from "@mantine/core";
import { matchSorter } from "match-sorter";
import React from "react";

interface Props extends BasicStyledCmpProps {
  options:{label:string,value:string}[],
  placeholder?:string,
  value?:string,
  required?:boolean
  error?:string
  label?:React.ReactNode
  selId?:NonNullable<unknown>
  style?:React.CSSProperties
  ['aria-label']?:string
  onChange?:(option?:{label:string,value:string},selId?:NonNullable<unknown>)=> void
}

const filter:OptionsFilter = (input)=>{
  return matchSorter(input.options,input.search,{
    keys:['label'],
    keepDiacritics:true
  })
};

const SearchableSelect:FC<Props> = ({
  options,
  selId,
  error,
  value,
  required,
  placeholder,
  style,
  onChange,
  ...baseProps
}) => {
    const onSelectionChange = React.useCallback(
        (_value:string|null,option:ComboboxItem|null) => {
          console.log(`Selection changed to '${_value}' '${JSON.stringify(option)}`)
            onChange 
            && onChange(option ?? undefined,selId);
        },[onChange,selId]
    );
  return (
      <Box style={style}>
    <Select data={options} 
    selectFirstOptionOnChange
    onChange={onSelectionChange}
    error={error}
    filter={filter}
    value={value}
    searchable
    {...baseProps} />
    </Box>
  )
};

export { SearchableSelect, type Props as SearchableSelectProps };
