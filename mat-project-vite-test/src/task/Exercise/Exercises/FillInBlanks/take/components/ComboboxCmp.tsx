import { Combobox, Input, useCombobox } from "@mantine/core";
import { CSSProperties, useEffect, useState } from "react";
import React from "react";
import styles from "./ComboboxCmpStyle.module.css"
import { matchSorter } from "match-sorter";
import { defaultHiddenSpanStyle } from "../../../../../../types/props/props";
import { resizeInput31 } from "../../../../../../utils/utils";

interface Props {
options:string[]
onSelectionChange?:(value:string,index:number,dataAttr:unknown) => void;
style?:React.CSSProperties
name?:string
defaultValue?:number;
className?:string;
'data-attr':unknown;
}

type MyOption = {name:string,value:string,index:number};

const checkDefaultValue = (index:number,length:number) =>{
  if(index >= length){
    throw new Error(`Invalid default index: ${index}`);
  }
  return index;
}

const ComboboxCmp = React.memo(({options,'data-attr':dataAttr,onSelectionChange,style,defaultValue,name,className}:Props) => {

 const inputStyle = React.useMemo<CSSProperties>(() => (
  {
font:'inherit',
padding:'0 0.125rem',
textAlign:'center',
...style,
boxSizing:'content-box',
 }
 ),[style]);

 const spanStyle = React.useMemo<React.CSSProperties>(() => ({
  ...inputStyle,
  boxSizing:'content-box',
  ...defaultHiddenSpanStyle
 }),[inputStyle]);

 const dropdownRef = React.useRef<HTMLDivElement>(null);
 const inputRef = React.useRef<HTMLInputElement>(null);
 const hiddenSpanRef = React.useRef<HTMLSpanElement>(null);
 
 const objOptions = React.useMemo<MyOption[]>(() => (options.map((option,i) => ({
  name:option,
  index:i,
  value:i.toString()
 }))),[options]);


 const combobox = useCombobox({
  onDropdownOpen() {
    combobox.selectFirstOption();
  },
  onDropdownClose() {
    isSearchingRef.current = false;
    combobox.resetSelectedOption();
  },
});


const longestOption = React.useMemo<{value:string,index:number}>(() => {
  let longestI = -1;
  if (options.length < 1) {
    return { value: '', index: longestI };
  }
  longestI = 0;
  options.forEach((opt, i) => {
    if (opt.length > options[longestI].length) {
      longestI = i;
    }
  })
  return { value: options[longestI], index: longestI };
},[options]);

const [selectedOptionIndex,setSelectedOptionIndex] = useState<number>(
  defaultValue !== undefined ? checkDefaultValue(defaultValue,options.length) : -1
  );

const [search, setSearch] = useState(selectedOptionIndex < 0 ? '' : objOptions[selectedOptionIndex].name);


const onOptionSubmit = React.useCallback((val:string) => {
  const selectedIndex = Number.parseInt(val);
  if(selectedOptionIndex !== selectedIndex){
  const selectedOption = objOptions[selectedIndex];
  if(!selectedOption){
    console.warn(`Invalid selected option index '${selectedIndex}'`);
    return;
  }
  console.log(`Submited option :${JSON.stringify(selectedOption)}, val: ${val}`);
   setSelectedOptionIndex(selectedIndex);
   setSearch(selectedOption.name);
   onSelectionChange && onSelectionChange(selectedOption.name,selectedIndex,dataAttr);
  }
   combobox.closeDropdown();
 },[combobox,selectedOptionIndex,onSelectionChange,objOptions,dataAttr]);

 const filteredOptions = React.useMemo(() => {
  if(search === ''){
    return objOptions;
  }
  const index = objOptions.findIndex(o => o.name === search);
  if(index >= 0){
    return [objOptions[index]];
  }
  console.log(`search: ${search}`);
   return matchSorter(objOptions,search,{keys:['name']});
},[objOptions,search]);

const isSearchingRef = React.useRef<boolean>(false);
const dropdownOptions = isSearchingRef.current === true ? filteredOptions : objOptions;

const onInputChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
  if(!isSearchingRef.current){
    isSearchingRef.current = true;
    }
    if(!combobox.dropdownOpened){
  combobox.openDropdown();
    }
  combobox.updateSelectedOptionIndex();
  const newSearch = event.target.value;
  if(search !== newSearch){
  setSearch(newSearch);
  }
},[combobox,search]);

 const inputEvents = React.useMemo(() => {
return {
onClick(){
  combobox.openDropdown()
},
onFocus(){
  combobox.openDropdown()
}
};
 },[combobox]);

const onBlur = React.useCallback(() => {
  combobox.closeDropdown();
  setSearch((selectedOptionIndex !== undefined && selectedOptionIndex >= 0 && selectedOptionIndex < objOptions.length ? objOptions[selectedOptionIndex].name : ''));
},[combobox,objOptions,selectedOptionIndex]);

console.log(`Combobox rerendering...${Date.now()}`);

useEffect(() => {
  if(!combobox.dropdownOpened){
    inputRef.current 
    && hiddenSpanRef.current 
    && resizeInput31(inputRef.current,hiddenSpanRef.current,search,undefined,longestOption.value);
  }
},[combobox.dropdownOpened,longestOption,options,search]);

const wrapperClassName = React.useMemo(()=>styles.cmbWrapper+' '+className,[className]);
  return (<div className={wrapperClassName}>
    <Combobox
      store={combobox}
      position={"bottom"}
      withinPortal={false}
      onOptionSubmit={onOptionSubmit}
    >
      <Combobox.Target>
        <Input.Wrapper>
        <input
        name={name}
        ref={inputRef}
        type={'text'}
        role={'textbox'}
        style={inputStyle}
          value={search}
          onChange={onInputChange}
          {...inputEvents}
          onBlur={onBlur}
        />
        <span ref={hiddenSpanRef} aria-hidden style={spanStyle} ></span>
        </Input.Wrapper>
      </Combobox.Target>

      <Combobox.Dropdown ref={dropdownRef} className={styles.dropdown}>
        <Combobox.Options >
          {dropdownOptions.length > 0 ? dropdownOptions.map((item,i) => {
            const isEmpty = item.name.length === 0;
            const isSpace = !isEmpty && item.name.trim().length === 0;
            const value = isEmpty ? " " : item.name;
            const ariaLabel = isEmpty ? "Empty option" : undefined;
            
            return (
    <Combobox.Option value={item.value} selected={i === 0} key={item.name} className={styles.option}>
      <span className={styles.optionValue} data-space={isSpace ? true : undefined} data-empty={isEmpty ? true : undefined} aria-label={ariaLabel}>{value}</span>
    </Combobox.Option>
  );
  }) : <Combobox.Empty>Nothing found</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
     
    </div>
  );
});
ComboboxCmp.displayName = 'ComboboxCmp';
export { ComboboxCmp, type Props as ComboboxCmpProps };
