import React, { FC } from "react"
import { SortableListCmp } from "../Sortable/SortableList/SortableListCmp";
import { ActionIconCmp } from "../ActionIcon/ActionIconCmp";
import { UpArrowIconCmp } from "../Icons/UpArrowIconCmp";
import { DownArrowIconCmp } from "../Icons/DownArrowIconCmp";
import { Box, Button, CloseButton, Group, Stack, Text } from "@mantine/core";
import { SearchableSelect, SearchableSelectProps } from "../SearchableSelectCmp";
import { State} from "@hookstate/core";
import { arrayMove } from "@dnd-kit/sortable";


type Value = {
    dir:'ASC'|'DESC',
    ci:number
};

interface Props {
columns:string[]|ReadonlyArray<string>;
values:State<Value[]>;
}

const MultiColSortCmp:FC<Props> = React.memo(({columns,values}) => {

    const items = React.useMemo(()=>
    values.value.map((_v,i) => i),
    [values]);

    const [availableColumnsDict,availableColumns] = React.useMemo(()=> {
        const res:(string|undefined)[] = [...columns];
        for(const value of values.value){
            res[value.ci] = undefined;
        }
        const cols = [];
        const dict:Record<string,number>= {};
        const resLen = res.length;
        for(let i = 0;i < resLen;++i){
            const item = res[i];
            if(item !== undefined){
                dict[item] = i;
                cols.push(item);
            }
        }
        return [dict,cols];
    },[columns, values.value]);

    const changeItemDir = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>((e)=>{
       const i = e.currentTarget.dataset['itemindex'] ?? undefined;
        if(i !== undefined){
            const iNum =Number(i);
            const value = values[iNum] ?? undefined;
            if(value !== undefined){
            value.set(prev =>  ({ci:prev.ci,dir:prev.dir === 'ASC' ? 'DESC' : 'ASC'}));
            }
        }
    },[values]);

    const onCloseBtnClick = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>((e)=>{
        const i = e.currentTarget.dataset['itemindex'] ?? undefined;
        if(i !== undefined){
            const iNum = Number(i);
        values.set(prev => prev ? [...prev.slice(0,iNum),...prev.slice(iNum+1)] : []);
        }
    },[values]);

    const renderItem = React.useCallback((i:number)=>{
        const value = values[i].value;
        const name = columns[value.ci];
        const dir = value.dir;
        return (<Group mt={'0.25rem'}>
            <Text>{name}</Text>
            <ActionIconCmp 
            onClick={changeItemDir} 
            data-itemindex={i} 
            ml={'auto'}
            title={`Change direction to ${dir === 'ASC' ? 'descending' : 'ascending'}`}>
                {dir === 'ASC' ? <UpArrowIconCmp /> : <DownArrowIconCmp />}
            </ActionIconCmp>
            <CloseButton onClick={onCloseBtnClick} data-itemindex={i} ></CloseButton>
        </Group>);
    },[changeItemDir, columns, onCloseBtnClick, values]);

    const [item,setItem] = React.useState<string|null>(null);

    const onItemChange = React.useCallback<NonNullable<SearchableSelectProps['onChange']>>((option)=>{
        setItem(option?.value ?? '');
    },[]);

    const addItem = React.useCallback(()=>{
        if(item != null){
            setItem(null);
            console.log(`ADD ITEM`);
            values.merge([{ci:availableColumnsDict[item],dir:'ASC'}]);
        }
    },[availableColumnsDict, item, values]);
        
    const onSortEnd = React.useCallback((props: { oldIndex: number; newIndex: number; }) => {
        console.log(`Sorting move: ${props.oldIndex} to ${props.newIndex}`);
        values.set(prev => [...arrayMove(prev,props.oldIndex,props.newIndex)]);
    },[values]);

  return (
    <Stack w={'100%'}>
        <SortableListCmp items={items} onSortEnd={onSortEnd} renderItem={renderItem} />
        <Box>
            <SearchableSelect 
            value={item}
            options={availableColumns}
            onChange={onItemChange}
            
            />
            <Button mt={'md'} onClick={addItem}>Add</Button>
        </Box>
    </Stack>
  );
});
MultiColSortCmp.displayName = "MultiColSortCmp";

export { MultiColSortCmp, type Props as MultiColSortCmpProps };
