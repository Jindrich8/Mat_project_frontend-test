import { Stack, Group, Button } from "@mantine/core";
import { DataTable, DataTableColumn, DataTableProps } from "mantine-datatable";
import React, { useEffect } from "react";
import { ActionIconCmp } from "../ActionIcon/ActionIconCmp";
import { ReloadIconCmp } from "../Icons/ReloadIconCmp";
  
  const setUrlHashNoRefresh = (newHash: string) => {
    if (!newHash.startsWith('#')) {
      newHash = '#' + newHash;
    }
    if (document.location.hash !== newHash) {
      const href = document.location.href;
      const hashIndex = href.indexOf('#');
      const hrefNoHash = hashIndex >= 0 ? href.substring(0, hashIndex) : href;
      history.replaceState(history.state, '', hrefNoHash + newHash);
    }
  };
  
  const setUrlHashToFirstVisibleRowId = async (tableBody: HTMLTableSectionElement, yPos: number): Promise<boolean> => {
    const trs = [...tableBody.querySelectorAll('tr')];
    let firstVisibleTr = null;
    for (const tr of trs) {
      if (tr.offsetTop + tr.offsetHeight >= yPos) {
        firstVisibleTr = tr;
        break;
      }
    }
    const id = firstVisibleTr?.id;
    if (id) {
      const newHash = '#' + id;
      setUrlHashNoRefresh(newHash);
      return true;
    }
    return false;
  };

interface Props<Rec extends {
    id:string,
    [str:string]:unknown
}> {
firstRowId?:string|null;
rowIdPrefix:string;
tableColsKey:string;
columns:DataTableColumn<Rec>[];
customRowAttributes?:DataTableProps<Rec>['customRowAttributes'];
records?:Rec[];
renderBarBtns:() => React.ReactNode;
cursors:{
    prev?:string;
    next?:string;
},
refetchRecords:() => void|Promise<void>;
setCursor:(cursor?:string) => void|Promise<void>;
}

const DataTableCmp = <Rec extends {
    id:string,
    [str:string]:unknown
},>({
    firstRowId,
    rowIdPrefix,
    tableColsKey,
    columns,
    customRowAttributes,
    records,
    cursors,
    refetchRecords,
    renderBarBtns,
    setCursor
}:Props<Rec>) => {
    const tableBodyRef = React.useRef<HTMLTableSectionElement>(null);

    const hash = React.useRef<string>('');

  const tableScrollViewportRef = React.useRef<HTMLDivElement>(null);

  const prevTableScrollPos = React.useRef<{
    x: number,
    y: number
  } | null>(null);

  const onTableScroll = React.useCallback<NonNullable<DataTableProps['onScroll']>>(
    async (pos) => {
      if (tableScrollViewportRef.current && prevTableScrollPos.current?.y !== pos.y) {
        const tableBody = tableBodyRef.current;
        if (tableBody) {
          setUrlHashToFirstVisibleRowId(tableBody, pos.y);
        }
      }
      prevTableScrollPos.current = pos;
    }, []);

    const customTableRowAttributes = React.useCallback<NonNullable<DataTableProps<Rec>['customRowAttributes']>>(
        (record,index) => {
          const attrs = customRowAttributes ? customRowAttributes(record,index) : {};
          return { id: rowIdPrefix + record.id,...attrs};
        }, [customRowAttributes, rowIdPrefix]);

    useEffect(() => {
        const locationHash = document.location.hash;
        hash.current = locationHash ? locationHash.substring(1) : locationHash;
      }, []);

  useEffect(() => {
    if (firstRowId != null) {
      if (hash.current === '') {
        const firstRowIdHash = rowIdPrefix + firstRowId;
        hash.current = firstRowIdHash;
        prevTableScrollPos.current = null;
      }
      document.getElementById(hash.current)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      if (window.location.hash !== '#' + hash.current) {
        setUrlHashNoRefresh(hash.current);
        console.log("Changing hash");
      }
    }
  }, [firstRowId, rowIdPrefix]);

  const resetScrollPos = React.useCallback(()=>{
    hash.current = '';
    prevTableScrollPos.current = null;
  },[]);

  const firstPage = React.useCallback(() => {
    resetScrollPos();
    setCursor(undefined);
  }, [resetScrollPos, setCursor]);

  const prevPage = React.useCallback(() => {
    resetScrollPos();
    setCursor(cursors.prev);
  }, [cursors.prev, resetScrollPos, setCursor]);

  const nextPage = React.useCallback(() => {
    resetScrollPos();
    setCursor(cursors.next);
  }, [cursors.next, resetScrollPos, setCursor]);


  return (
    <Stack mt={'md'}>
        <Group>
            {renderBarBtns()}
            <ActionIconCmp title={'Aktualizovat data'} onClick={refetchRecords} mr={'1.5rem'}>
          <ReloadIconCmp />
        </ActionIconCmp>
        </Group>
        <DataTable
        bodyRef={tableBodyRef}
        scrollViewportRef={tableScrollViewportRef}
        withColumnBorders
        withTableBorder
        height={'min(35rem,70vh)'}
        storeColumnsKey={tableColsKey}
        columns={columns}
        fetching={firstRowId === undefined}
        pinLastColumn
        onScroll={onTableScroll}
        customRowAttributes={customTableRowAttributes}
        contextMenu="W"
        records={records} />
           <Group>
        <Button disabled={cursors.prev === undefined} onClick={firstPage}>První</Button>
        <Button disabled={cursors.prev === undefined} onClick={prevPage}>Předchozí</Button>
        <Button disabled={cursors.next === undefined} onClick={nextPage}>Další</Button>
      </Group>
    </Stack>
  );
};

export { DataTableCmp, type Props as DataTableCmpProps };
