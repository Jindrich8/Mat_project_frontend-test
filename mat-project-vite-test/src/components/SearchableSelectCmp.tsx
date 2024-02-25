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
  ['aria-label']?:string
  onChange?:(label:string,value:string,selId?:NonNullable<unknown>)=> void
}

const filter:OptionsFilter = (input: { options: readonly string[]; search: string; })=>{
  return matchSorter(input.options,input.search,{
    keys:['label'],
    keepDiacritics:true
  })
};

const SearchableSelect:FC<Props> = ({options,selId,error,value,required,placeholder,onChange,key,...baseProps}) => {
    const onSelectionChange = React.useCallback(
        (_value:string|null,option:ComboboxItem) => {
            onChange 
            && onChange(option.label,option.value,selId);
        },[onChange,selId]
    );
  return (
      <Box key={key} style={{width:'50%',minWidth:'10rem'}}>
    <Select data={options} 
    selectFirstOptionOnChange
    onChange={onSelectionChange}
    error={error}
    filter={filter}
    searchable
    {...baseProps} />
    </Box>
  )
};

export { SearchableSelect, type Props as SearchableSelectProps };
