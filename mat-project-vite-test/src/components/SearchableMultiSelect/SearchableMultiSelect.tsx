/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from "react"
import { BasicStyledCmpProps } from "../../types/props/props";
import { Box, ComboboxData, MultiSelect } from "@mantine/core";
import { matchSorter } from "match-sorter";
import { OptionsFilter } from "@mantine/core";

interface Props extends BasicStyledCmpProps {
  options:ComboboxData,
  placeholder?:string
  selId?:NonNullable<unknown>
  required?:boolean,
  value?:string[],
  error?:string
  onChange?:(selected:string[],selId?:NonNullable<unknown>)=>void
  label?:React.ReactNode
}

const filter:OptionsFilter = (input)=>{
  return matchSorter(input.options,input.search,{
    keys:['label'],
    keepDiacritics:true
  });
};

const SearchableMultiSelect:FC<Props> = React.memo(({options,onChange,selId,...baseProps}) => {
  console.log("SearchableMultiSelect - options: ");
  console.log(JSON.stringify(options,undefined,4));
  const onSelectionChange = React.useCallback((selected:string[])=>{
    onChange && onChange(selected,selId);
  },[onChange,selId]);
  return (
      <Box style={{width:'50%',minWidth:'10rem'}}>
    <MultiSelect data={options} 
    selectFirstOptionOnChange
    filter={filter}
    hidePickedOptions
    searchable
    onChange={onSelectionChange}
    {...baseProps} />
    </Box>
  )
});
SearchableMultiSelect.displayName = 'SearchableMultiSelect';
export { SearchableMultiSelect, type Props as SearchableMultiSelectProps };
