import React, { FC } from "react"
import { SortableListCmpProps, SortableListCmp } from '../SortableList/SortableListCmp';
import { arrayMove } from "@dnd-kit/sortable";

interface Props {

}

const SortableExampleCmp:FC<Props> = () => {
   // The SortableContext unique identifiers
  // must be strings or numbers bigger than 0.
  const [items, setItems] = React.useState<number[]>(
    () => [0, 1, 2, 3, 4, 5].map((id) => id + 1)
  );
  
  const onSortEnd = React.useCallback<SortableListCmpProps['onSortEnd']>(
    ({ oldIndex, newIndex }) => {
      setItems((items) => [...arrayMove(items, oldIndex, newIndex)]);
    },
    []
  );
  const renderItem = React.useCallback((id:number)=>{
    return (`Item id: ${id}`);
  },[]);

  return (<SortableListCmp renderItem={renderItem} items={items} onSortEnd={onSortEnd} />);
};

export { SortableExampleCmp, type Props as SortableExampleCmpProps };