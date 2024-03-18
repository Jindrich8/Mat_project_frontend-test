import { useSensors, useSensor, MouseSensor, TouchSensor, DndContext, KeyboardSensor, closestCenter, DndContextProps } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import React, { FC, useState } from "react"
import { SortableItemCmp } from "../SortableItem/SortableItemCmp";
import styles from "./SortableListCmpStyle.module.css";

/*
https://medium.com/nerd-for-tech/from-react-sortable-hoc-to-dnd-kit-c17122dc67ba
*/
interface Props {
    items:number[],
    onSortEnd:(props:{oldIndex:number, newIndex:number})=>void;
    renderItem:(id:number) => React.ReactNode;
}

const SortableListCmp:FC<Props> = React.memo(({ items, onSortEnd,renderItem }) => {
    const [activeId, setActiveId] = useState<number | null>(null);
    const sensors = useSensors(
      useSensor(MouseSensor, {
        // Require the mouse to move by 10 pixels before activating.
        // Slight distance prevents sortable logic messing with
        // interactive elements in the handler toolbar component.
        activationConstraint: {
          distance: 10,
        },
      }),
      useSensor(TouchSensor, {
        // Press delay of 250ms, with tolerance of 5px of movement.
        activationConstraint: {
          delay: 250,
          tolerance: 5,
        },
      }),
      useSensor(KeyboardSensor,{

      })
    );
    const onDragStart = React.useCallback<NonNullable<DndContextProps['onDragStart']>>(({active})=>{
      console.log(`onDragStart ${active.id}`);
        setActiveId(+active.id);
    },[]);

    const onDragEnd = React.useCallback<NonNullable<DndContextProps['onDragEnd']>>(({active,over})=>{
      console.log(`onDragEnd ${active.id} ${over?.id ?? 'null'}`);
      if (over != null && active.id !== over.id) {
        onSortEnd({
          oldIndex: items.indexOf(+active.id),
          newIndex: items.indexOf(+over.id),
        });
      }
      setActiveId(null);
    },[items, onSortEnd]);

    const onDragCancel = React.useCallback<NonNullable<DndContextProps['onDragCancel']>>(()=>
    
    setActiveId(null),
    []);
  
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <ul className={"sortable-list "+styles.list}>
            {items.map((id) => (
              <SortableItemCmp key={`item-${id}`} id={id} activeId={activeId} renderItem={renderItem} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    );
});
SortableListCmp.displayName = 'SortableListCmp';
export { SortableListCmp, type Props as SortableListCmpProps };