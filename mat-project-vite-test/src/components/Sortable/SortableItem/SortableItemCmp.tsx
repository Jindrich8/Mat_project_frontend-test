import React, { FC } from "react"
import { CSS as cssDndKit } from '@dnd-kit/utilities';
import { useSortable } from "@dnd-kit/sortable";
import styles from "./SortableItemCmpStyle.module.css";

/*
https://medium.com/nerd-for-tech/from-react-sortable-hoc-to-dnd-kit-c17122dc67ba
*/

interface Props {
    id:number;
    activeId:number|null;
    renderItem:(id:number) => React.ReactNode;
}

const SortableItemCmp:FC<Props> = React.memo(({ id, activeId,renderItem }) => {
    const { setNodeRef, transform, transition, listeners } = useSortable({ id });
    const style = React.useMemo(() =>({
      transform: cssDndKit.Transform.toString(transform),
      transition,
    }),[transform, transition]);
  
    return (
      <li
        ref={setNodeRef}
        style={style}
        {...listeners}
        className={((activeId === id) ? 'sortable-item dragging-dbd-kit' : 'sortable-item')+ ' '+styles.listItem}
      >
        {renderItem(id)}
      </li>
    );
});

SortableItemCmp.displayName = 'SortableItemCmp';

export { SortableItemCmp, type Props as SortableItemCmpProps };