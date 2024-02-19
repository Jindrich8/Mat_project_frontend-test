/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react"
import { BasicStyledCmpProps } from "../types/props/props";
import { Box, MultiSelect } from "@mantine/core";
import { matchSorter } from "match-sorter";
interface Props extends BasicStyledCmpProps {
  options:{label:string,value:string}[],
  placeholder:string
}

const SearchableMultiSelect:FC<Props> = ({options,placeholder,key,...baseProps}) => {
  return (
      <Box key={key} style={{width:'50%',minWidth:'10rem'}}>
    <MultiSelect data={options} 
    selectFirstOptionOnChange
    filter={(input)=>{
      return matchSorter(input.options,input.search,{
        keys:['label'],
        keepDiacritics:true
      })
    }}
    placeholder={placeholder}
    hidePickedOptions
    searchable
    {...baseProps} />
    </Box>
  )
};

export { SearchableMultiSelect, type Props as SearchableMultiSelectProps };
