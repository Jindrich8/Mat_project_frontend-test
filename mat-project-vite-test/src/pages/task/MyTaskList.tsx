/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataTableColumn, useDataTableColumns } from "mantine-datatable";
import React, { FC, useEffect } from "react"
import { createAuthApiController } from "../../components/Auth/auth";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { Button, Group, Pill, PillGroup, Stack, Switch, Text, TextInput } from "@mantine/core";
import { EnumElement, OrderedEnumElement } from "../../api/dtos/success_response";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EyeIconCmp } from "../../components/Icons/EyeIconCmp";
import { ListRangeCmp } from "../../components/ListRange/ListRangeCmp";
import { getTaskCreateInfo } from "../../api/task/createInfo/createInfo";
import { SearchableMultiSelect } from "../../components/SearchableMultiSelect/SearchableMultiSelect";
import { arrayLast, dump, nundef, setSearchParam, tryStrToNum, utcStrTimestampToLocalStr } from "../../utils/utils";
import { useListRange } from "../../components/ListRange/ListRangeType";
import { useHookstate } from "@hookstate/core";
import { ListMyTasksRequest } from "../../api/dtos/request";
import { ErrorResponseState } from "../../types/types";
import { ActionIconCmp } from "../../components/ActionIcon/ActionIconCmp";
import { useDisclosure } from "@mantine/hooks";
import { RestoreIconCmp } from "../../components/Icons/RestoreIconCmp";
import { AdjustmentsIconCmp } from "../../components/Icons/AdjustmentsIconCmp";
import { MultiColSortCmp } from "../../components/MultiColSort/MultiColSortCmp";
import { ArrowSortIconCmp } from "../../components/Icons/ArrowSortIconCmp";
import { FilterSettingsIconCmp } from "../../components/Icons/FilterSettingsIconCmp";
import { DataTableCmp, DataTableCmpProps } from "../../components/DataTable/DataTableCmp";
import { listMyTasks } from "../../api/task/myList/get";
import { DateValue } from "@mantine/dates";
import { DateTimeRangeInputCmp } from "../../components/DateTimeRangeInput/DateTimeRangeInputCmp";
import { TagsCmp } from "../../components/Tags/TagsCmp";
import { EditIconCmp } from "../../components/Icons/EditIconCmp";
import { TrashIconCmp } from "../../components/Icons/TrashIconCmp";
import { deleteTask as apiDeleteTask } from "../../api/task/delete/delete";
import { SuccessAlertCmp } from "../../components/SuccessAlert/SuccessAlertCmp";
import { PlayerPlayIconCmp } from "../../components/Icons/PlayerPlayIconCmp";
import { ModalCmp } from "../../components/Modal/ModalCmp";

interface Props {

}

/*
  id: string;
  name: string;
  difficulty: OrderedEnumElement;
  class_range: OrderedEnumRange;
  creation_timestamp: string;
  modification_timestamp?: string;
  tags: EnumElement[];
  */
type Rec = {
  id: string;
  name: string;
  difficulty: OrderedEnumElement;
  minClass: OrderedEnumElement;
  maxClass: OrderedEnumElement;
  creation_timestamp: string;
  modification_timestamp?: string;
  tags: EnumElement[];
  isPublic:boolean;
};
const basicColProps = { draggable: true, resizable: true };

const rowIdPrefix = 'task-row-';
const key = 'mytask-list-resizable-columns';
const limit = 50;
const listTasksControl = createAuthApiController();

const taskCreateInfoControl = createAuthApiController();

const deleteTaskControl = createAuthApiController();

const setRangeParamIfNotUndef = <T,>(params: URLSearchParams, keyBase: string, range: {
  min?: T,
  max?: T,
  [other: PropertyKey]: unknown
}) => {
  if (range.min !== undefined) {
    setSearchParam(params, 'min' + keyBase, range.min?.toString() ?? undefined);
  }
  if (range.max !== undefined) {
    setSearchParam(params, 'max' + keyBase, range.max?.toString() ?? undefined);
  }
};

const getNumRangeParam = (params: URLSearchParams, keyBase: string) => {
  return [
    tryStrToNum(params.get('min' + keyBase), undefined) ?? undefined,
    tryStrToNum(params.get('max' + keyBase), undefined) ?? undefined
  ] as const;

};

const emptyArrayToUndef = <T,>(arr: T[]) => {
  return arr.length === 0 ? undefined : arr;
};


const orderByParamToObj = (orderBy: string): { ci: number, dir: 'ASC' | 'DESC' } => {
  const desc = orderBy.endsWith('D');
  if (desc) {
    orderBy = orderBy.substring(0, orderBy.length - 1);
  }
  return { ci: Number(orderBy), dir: desc ? 'DESC' : 'ASC' };
};

const serializeOrderByObj = (ci: number, dir: 'ASC' | 'DESC') => {
  return (ci + "") + (dir === 'DESC' ? 'D' : '');
};


const apiValidOrderByCols = ["name", "difficulty", "class_range", "creation_timestamp", "modification_timestamp"] as const;
const validOrderByCols = ["Název", "Obtížnost", "Rozsah tříd", "Datum a čas vytvoření", "Datum a čas změny"] as const;

/*
  id: string;
  name: string;
  difficulty: OrderedEnumElement;
  class_range: OrderedEnumRange;
  creation_timestamp: string;
  modification_timestamp?: string;
  tags: EnumElement[];
  */
const columnAccessorToTitleDict: Record<string, string> = {
  'id': 'ID',
  'name': "Název",
  'difficulty': "Difficulty",
  'minClass': "Min. třída",
  'maxClass': "Max. třída",
  'tags': "Štítky",
  'isPublic': "Je veřejná",
  'creation_timestamp': "Datum a čas vytvoření",
  'modification_timestamp': "Datum a čas změny"
};

const columnAccessorToTitle = (accessor: string) => {
  return columnAccessorToTitleDict[accessor] ?? accessor;
}

const columnAccessorAndTitle = (accessor: string) => {
  return {
    title: columnAccessorToTitle(accessor),
    accessor: accessor
  };
};

const getDateParam = (params:URLSearchParams,key:string) =>{
  const value = params.get(key);
  return value ? new Date(value) : undefined;
}

const serializeDate = (date:Date) => {
  return date.toISOString();
}

const getTimestampParam = (params:URLSearchParams,key:string) => {
  return getDateParam(params,key)?.toISOString();
}

const MyTaskList: FC<Props> = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const [createInfo, setCreateInfo] = React.useState<{
    tags: Array<{ value: string, label: string }>,
    sortedDifficulties: Array<{ orderedId: number, name: string }>,
    sortedClasses: Array<{ orderedId: number, name: string }>
  } | undefined>(undefined);

  const [successAlert,setSuccessAlert] = React.useState<{message:string}>();

  const [error, setError] = React.useState<ErrorResponseState>();
  const clearError = React.useCallback(() => setError(undefined), [setError]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreateInfo = async () => {
      const response = await getTaskCreateInfo(null, taskCreateInfoControl);
      //  console.log('response: ' + JSON.stringify(response));
      if (response.success) {
        const data = response.body.data;
        console.log('data: ');
        console.log(JSON.stringify(data));
        setCreateInfo({
          tags: data.tags.map(tag => ({ label: tag.name, value: tag.id + '' })),
          sortedDifficulties: data.difficulties.map(diff => ({ orderedId: diff.orderedId, name: diff.name }))
            .sort((a, b) => a.orderedId - b.orderedId),
          sortedClasses: data.classes.map(c => ({ orderedId: c.orderedId, name: c.name }))
            .sort((a, b) => a.orderedId - b.orderedId)
        });
      }
      else if (response.isServerError) {
        setError(
          {
            error: response.error?.error,
            status: response.status,
            statusText: response.statusText
          }
        );
      }

    };
    if (!createInfo) {
      fetchCreateInfo();
    }
  }, [createInfo, setError]);

  console.log("Rerendering MyTaskListCmp");
  const [page, setPage] = React.useState<
    {
      records?: Rec[] | undefined,
      nextCursor?: string,
      prevCursor?: string
    } | undefined>(undefined);

  const [name, setName] = React.useState<string | null | undefined>(searchParams.get('name') ?? undefined);

  const [tags, setTags] = React.useState<string[] | null | undefined>(emptyArrayToUndef(searchParams.getAll('tags[]')));

  const [createdFrom,setCreatedFrom] = React.useState<DateValue|undefined>(getDateParam(searchParams, 'createdFrom'));
  const [createdTill,setCreatedTill] = React.useState<DateValue|undefined>(getDateParam(searchParams, 'createdTill'));

  const [updatedFrom,setUpdatedFrom] = React.useState<DateValue|undefined>(getDateParam(searchParams, 'updatedFrom'));
  const [updatedTill,setUpdatedTill] = React.useState<DateValue|undefined>(getDateParam(searchParams, 'updatedTill'));

  const navigateToTaskDetail = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
    e.stopPropagation(); // prevent
    const id = e.currentTarget.dataset['id'];
    navigate(`/task/${id}/myDetail`);
  }, [navigate]);

  const navigateToTaskUpdate = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
    e.stopPropagation(); // prevent
    const id = e.currentTarget.dataset['id'];
    navigate(`/task/${id}/update`);
  }, [navigate]);

  const navigateToTaskTake = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
    e.stopPropagation(); // prevent
    const id = e.currentTarget.dataset['id'];
    navigate(`/task/${id}/take`);
  }, [navigate]);

  const deleteTask = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>(async(e) => {
    e.stopPropagation(); // prevent
    const id = e.currentTarget.dataset['id'];
    const index = e.currentTarget.dataset['index'];
    if(id !== undefined && index !== undefined){
      const numIndex = Number(index);
    const response = await apiDeleteTask(id,deleteTaskControl);
    if(response.success){
      setSuccessAlert({
        message: `Task with id '${id}' deleted successfully`
      });
      setPage(prev => {
        let newRecords = prev?.records;
        const records = prev?.records;
        if(records !== undefined){
          newRecords = [...records];
          newRecords.splice(numIndex,1);
        }
       return {...prev,records:newRecords};
      });
    }
    else if(response.isServerError){
      setError({
        status:response.status,
        statusText:response.statusText,
        error:response.error?.error
      });
    }
  }
  }, []);

  /*
  id: string;
  name: string;
  difficulty: OrderedEnumElement;
  class_range: OrderedEnumRange;
  creation_timestamp: string;
  modification_timestamp?: string;
  tags: EnumElement[];
  */
  const columns = React.useMemo(() => ({
    key: key,
    columns: [
      {
        ...columnAccessorAndTitle('id'),
        toggleable: true,
        resizable: false,
        draggable: false,
      } as const,
      {
        ...columnAccessorAndTitle('name'),
        toggleable: true,
        ...basicColProps,
        render(record) {
          return (<Text w={'fit-content'} m={'auto'}>{record.name}</Text>);
        },
      } as const,
      {
        ...columnAccessorAndTitle('difficulty'),
        toggleable: true,
        ...basicColProps,
        render: (_record, _index) => {
          const difficulty = _record.difficulty;
          return (<Text w={'fit-content'} m={'auto'}>{difficulty.name}</Text>)
        }
      } as const,
      {
        ...columnAccessorAndTitle('minClass'),
        toggleable: true,
        ...basicColProps,
        render: (_record, _index) => {
          return (<Text w={'fit-content'} m={'auto'}>{_record['minClass']['name']}</Text>);
        }
      } as const,
      {
        ...columnAccessorAndTitle('maxClass'),
        toggleable: true,
        ...basicColProps,
        render: (_record, _index) => {
          return (<Text w={'fit-content'} m={'auto'}>{_record['maxClass']['name']}</Text>);
        }
      } as const,
      {
        ...columnAccessorAndTitle('tags'),
        toggleable: true,
        ...basicColProps,
        noWrap: true,
        render: (_record, _index) => {
          const tags = _record['tags'];
          return (<TagsCmp tags={tags.map(tag => tag.name)} />);
        }
      } as const,
      {
        ...columnAccessorAndTitle('creation_timestamp'),
        toggleable: true,
        ...basicColProps,
        noWrap: true,
        render: (_record, _index) => {
          const timestamp = _record['creation_timestamp'];
          return (<Text>{timestamp}</Text>);
        }
      } as const,
      {
        ...columnAccessorAndTitle('modification_timestamp'),
        toggleable: true,
        ...basicColProps,
        noWrap: true,
        render: (_record, _index) => {
          const timestamp = _record['modification_timestamp'] ?? '-';
          return (<Text>{timestamp}</Text>);
        }
      } as const,
      {
        ...columnAccessorAndTitle('isPublic'),
        toggleable: true,
        ...basicColProps,
        noWrap: true,
        render: (_record, _index) => {
          console.log('isPublic');
          return (<Text>{_record.isPublic ? "True" : "False"}</Text>);
        }
      } as const,
      {
        title: 'Akce',
        accessor: '#',
        draggable: false,
        resizable: false,
        render: (_record, _index) => {
          return (<Group wrap={'nowrap'}>
              <ActionIconCmp
              data-id={_record.id}
              onClick={navigateToTaskTake}
              title={'Vyplnit úlohu'}
            >
              <PlayerPlayIconCmp />
            </ActionIconCmp>
            <ActionIconCmp
              data-id={_record.id}
              onClick={navigateToTaskDetail}
              title={'Zobrait detail úlohy'}
            >
              <EyeIconCmp />
            </ActionIconCmp>
            <ActionIconCmp
              data-id={_record.id}
              onClick={navigateToTaskUpdate}
              title={'Upravit úlohu'}
            >
              <EditIconCmp />
            </ActionIconCmp>
            <ActionIconCmp
              data-index={_index}
              data-id={_record.id}
              onClick={deleteTask}
              title={'Smazat úlohu'}
            >
              <TrashIconCmp />
            </ActionIconCmp>
          </Group>);
        }
      } as const
    ] satisfies DataTableColumn<Rec>[]
  }), [deleteTask, navigateToTaskDetail, navigateToTaskTake, navigateToTaskUpdate]);

  const {
    effectiveColumns,
    columnsToggle,

    setColumnsToggle,

    resetColumnsWidth,
    resetColumnsToggle,
    resetColumnsOrder,

  } = useDataTableColumns(columns);

  const setCursor = React.useCallback((cursor?: string) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      if (cursor === undefined) {
        params.delete('cursor');
      }
      else {
        params.set('cursor', cursor);
      }
      return params;
    });
  }, [setSearchParams]);

  const fetchRecords = React.useCallback(async () => {
    console.log('Changing fetch records');
    if (createInfo) {
      console.log('Actual fetch records');
      const difficultyRange = getNumRangeParam(searchParams, 'Difficulty');
      const classRange = getNumRangeParam(searchParams, 'Class');
      const orderBy:NonNullable<ListMyTasksRequest['order_by']> = [];
      for(const rawSortPair of (searchParams.getAll('sort[]') ?? [])){
        const obj = orderByParamToObj(rawSortPair);
        const filterName = apiValidOrderByCols[obj.ci] ?? undefined;
        if(filterName !== undefined){
          orderBy.push({
            filter_name: filterName,
            type: obj.dir
          });
        }
      }
      console.log("ORDER BY TO API");
      console.debug(orderBy);
      const response = await listMyTasks({
        options:{
          limit: limit,
        cursor: searchParams.get('cursor') ?? null
        },
        filters: {
          name: searchParams.get('name') ?? undefined,
          tags: searchParams.getAll('tags[]') ?? undefined,
          difficulty_range: {
            min: Number((difficultyRange[0] ?? createInfo.sortedDifficulties[0].orderedId)),
            max: Number((difficultyRange[1] ?? arrayLast(createInfo.sortedDifficulties).orderedId))
          },
          class_range: {
            min: Number((classRange[0] ?? createInfo.sortedClasses[0].orderedId)),
            max: Number((classRange[1] ?? arrayLast(createInfo.sortedClasses).orderedId))
          },
          creation_timestamp_range:{
            min: getTimestampParam(searchParams,'createdFrom'),
            max: getTimestampParam(searchParams,'createdTill')
          },
          modification_timestamp_range:{
            min: getTimestampParam(searchParams,'updatedFrom'),
            max: getTimestampParam(searchParams,'updatedTill')
          }
        },
        order_by: orderBy
      }, listTasksControl);
      if (response.success) {
        const data = response.body.data;
        setPage({
          prevCursor: data.config.prev_cursor,
          nextCursor: data.config.next_cursor,
          records: data.tasks.map(t => {
            let modificationTimestamp = t.modification_timestamp;
            if(modificationTimestamp){
              modificationTimestamp = utcStrTimestampToLocalStr(modificationTimestamp);
            }
              return ({
            id: t.id,
            name: t.name,
            minClass: t.class_range.min,
            maxClass: t.class_range.max,
            tags: t.tags,
            creation_timestamp: utcStrTimestampToLocalStr(t.creation_timestamp),
            modification_timestamp: modificationTimestamp,
            difficulty: t.difficulty,
            isPublic: t.is_public
          });
        })
        });
      }
      else if (response.isServerError) {
        setError({
          status: response.status,
          statusText: response.statusText,
          error: response.error?.error
        });
      }
    }
  }, [createInfo, searchParams, setError]);

  useEffect(() => {
    console.log("Fetching records...");
    fetchRecords();
  }, [fetchRecords]);

  const onNameChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => setName(e.target.value),
    []);

  const difficultiesForCmp = React.useMemo(() => createInfo?.sortedDifficulties.map(d => d.name),
    [createInfo?.sortedDifficulties]);

  const classesForCmp = React.useMemo(() => createInfo?.sortedClasses.map(c => c.name),
    [createInfo?.sortedClasses]);

  const [classRange, setClassRange] = useListRange(
    classesForCmp ?? [],
    ...getNumRangeParam(searchParams, 'Class')
  );
  const [difficultyRange, setDifficultyRange] = useListRange(
    difficultiesForCmp ?? [],
    ...getNumRangeParam(searchParams, 'Difficulty')
  );

  const actualTags = React.useMemo(() => nundef(tags, searchParams.getAll('tags')) ?? [],
    [searchParams, tags]
  );

  const actualDifficultyRange = {
    min: nundef(difficultyRange.min, tryStrToNum(searchParams.get('minDifficulty'), undefined)) ?? undefined,
    max: nundef(difficultyRange.max, tryStrToNum(searchParams.get('maxDifficulty'), undefined)) ?? undefined,
    minError: difficultyRange.minError,
    maxError: difficultyRange.maxError
  };

  console.log(`Search params: ${JSON.stringify([...searchParams])}`);

  const actualClassRange = {
    min: nundef(classRange.min, tryStrToNum(searchParams.get('minClass'), undefined)) ?? undefined,
    max: nundef(classRange.max, tryStrToNum(searchParams.get('maxClass'), undefined)) ?? undefined,
    minError: classRange.minError,
    maxError: classRange.maxError
  };

  console.log(`actualDifficultyRange: ${JSON.stringify(actualDifficultyRange)}`);

  const actualName = nundef(name, searchParams.get('name')) ?? '';

  const actualCreationRange = {
    min: nundef(createdFrom,getDateParam(searchParams, 'createdFrom')) ?? null,
    max: nundef(createdTill,getDateParam(searchParams,'createdTill')) ?? null
  };

  const actualModificationRange = {
    min: nundef(updatedFrom,getDateParam(searchParams, 'updatedFrom')) ?? null,
    max: nundef(updatedTill,getDateParam(searchParams,'updatedTill')) ?? null
  };

  const onCreationRangeChange = React.useCallback((type:'from'|'to',value:DateValue) => {
    if(type === 'from'){
      setCreatedFrom(value);
    }
    else{
      setCreatedTill(value);
    }
  },[]);

  const onModificationRangeChange = React.useCallback((type:'from'|'to',value:DateValue) => {
    if(type === 'from'){
      setUpdatedFrom(value);
    }
    else{
      setUpdatedTill(value);
    }
  },[]);



  const sorting = useHookstate<{
    dir: "ASC" | "DESC";
    ci: number;
  }[]|undefined>(undefined);

  if(sorting.value === undefined){
    sorting.set(searchParams.getAll('sort[]').map(s => orderByParamToObj(s)) ?? []);
  }

  const filter = React.useCallback(() => {
    const params = new URLSearchParams();
    if (name !== undefined) {
      setSearchParam(params, 'name', name ?? undefined);
    }
    if (tags !== undefined) {
      setSearchParam(params, 'tags[]', tags ?? undefined);
    }
    if(createdFrom != null){
      setSearchParam(params, 'createdFrom',serializeDate(createdFrom));
    }
    if(createdTill != null){
      setSearchParam(params,'createdTill',serializeDate(createdTill));
    }
    if(updatedFrom != null){
      setSearchParam(params, 'updatedFrom',serializeDate(updatedFrom));
    }
    if(updatedTill != null){
      setSearchParam(params,'updatedTill',serializeDate(updatedTill));
    }
    setRangeParamIfNotUndef(params, 'Class', classRange);
    setRangeParamIfNotUndef(params, 'Difficulty', difficultyRange);
    if (sorting.value !== undefined && sorting.value.length > 0) {
      console.debug('Filter sort: ', sorting.value);
      setSearchParam(params, 'sort[]', sorting.value.map(v => serializeOrderByObj(v.ci, v.dir)));
    }

    setSearchParams(params);
  }, [classRange, createdFrom, createdTill, difficultyRange, name, setSearchParams, sorting.value, tags, updatedFrom, updatedTill]);

  const cursors = React.useMemo(()=>({
    prev:page?.prevCursor,
    next:page?.nextCursor
  }),[page?.nextCursor, page?.prevCursor]);



  const filterSettingsModal = useDisclosure(undefined);

  const orderByModal = useDisclosure(undefined);

  const columnsToggleSettingsModal = useDisclosure(undefined);
  const columnsToggleSettingsSwitchesWrapperOnChange = React.useCallback<React.FormEventHandler<HTMLDivElement>>((e) => {
    console.log("Toggle: ");
    console.log(dump(e.target));
    const target = e.target ?? e.currentTarget;

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      console.dir(target);
      const accesor = target.dataset['columnaccesor'] ?? undefined;
      console.log(target.dataset);
      if (accesor) {
        console.log(`accesor: ${accesor} to ${target.checked}`);
        setColumnsToggle(prev => prev.map(c => c.accessor === accesor ? ({
          ...c,
          toggled: target.checked
        }) : c));
      }
    }
  }, [setColumnsToggle]);

  const renderTableBarBtns = React.useCallback<NonNullable<DataTableCmpProps<Rec>['renderBarBtns']>>(() => {
    return (
      <Group style={{flexGrow:1}}>
        <Group ml={'xs'}>
        <Text>Řazení: </Text>
        {sorting.value?.map((v,i) => {
          const label = validOrderByCols[v.ci];
          return (
            <PillGroup key={i} gap={'xs'}><Pill>{label}</Pill><Pill>{v.dir}</Pill></PillGroup>
          );
        })}
      </Group>
      <Group ml={'auto'}>
        <ActionIconCmp title={'Filtrace'} hiddenFrom={'md'} onClick={filterSettingsModal[1].open} >
          <FilterSettingsIconCmp />
        </ActionIconCmp>
        <ActionIconCmp title={'Řazení'} onClick={orderByModal[1].open}>
          <ArrowSortIconCmp />
        </ActionIconCmp>
        <ActionIconCmp title={'Nastavení sloupců'} onClick={columnsToggleSettingsModal[1].open}>
          <AdjustmentsIconCmp />
        </ActionIconCmp>
        </Group>
      </Group>);
  }, [columnsToggleSettingsModal, filterSettingsModal, orderByModal, sorting.value]);

  const clearSuccessAlert = React.useCallback(() => {
    setSuccessAlert(undefined);
  },[]);


  const firstRowId = page?.records ? (page.records.at(0)?.id ?? null) : undefined;
  return (
    <>
    {successAlert && <SuccessAlertCmp 
    withCloseButton
    onClose={clearSuccessAlert}
    >
      {successAlert.message}
      </SuccessAlertCmp>
    }
      {error && <ApiErrorAlertCmp
        status={error.status}
        statusText={error.statusText}
        error={error.error}
        onClose={clearError}
      />}
      <Stack align={'center'}>
        <Stack align={'center'}>
          <Group w={'100%'} justify={'center'}>
            <TextInput
              label={'Název'}
              value={actualName}
              onChange={onNameChange}
            />
            <SearchableMultiSelect
              options={createInfo?.tags ?? []}
              onChange={setTags}
              value={actualTags}
              required
              visibleFrom={'md'}
              label={'Štítky'}
            />
          </Group>
        <Stack align={'center'} visibleFrom={'md'}>
          <ListRangeCmp
            label={'Rozsah obtížnosti'}
            {...actualDifficultyRange}
            options={difficultiesForCmp ?? []}
            onChange={setDifficultyRange}
          />
          <ListRangeCmp
            label={'Rozsah tříd'}
            {...actualClassRange}
            options={classesForCmp ?? []}
            onChange={setClassRange}
          />
          <DateTimeRangeInputCmp
          fromLabel={'Vytvořeno od'}
          toLabel={'Vytvořeno do'}
          fromValue={actualCreationRange.min}
          toValue={actualCreationRange.max}
          onChange={onCreationRangeChange}
          />
          <DateTimeRangeInputCmp
          fromLabel={'Změněno od'}
          toLabel={'Změněno do'}
          fromValue={actualModificationRange.min}
          toValue={actualModificationRange.max}
          onChange={onModificationRangeChange}
          />
    </Stack>
        </Stack>
        <Button w={'fit-content'} onClick={filter}>Filtrovat</Button>
      </Stack>
      <DataTableCmp
      setCursor={setCursor}
      records={page?.records}
      cursors={cursors}
      rowIdPrefix={rowIdPrefix}
      tableColsKey={key}
      columns={effectiveColumns}
      firstRowId={firstRowId}
      renderBarBtns={renderTableBarBtns}
      refetchRecords={fetchRecords}
      />
      <ModalCmp
        opened={columnsToggleSettingsModal[0]}
        onClose={columnsToggleSettingsModal[1].close}
        withinPortal={false}
        withCloseButton>
        <Stack>
          <Group>
            <ActionIconCmp title={'Obnovit sloupce'} onClick={resetColumnsToggle}>
              <RestoreIconCmp />
            </ActionIconCmp>
            <Button onClick={resetColumnsWidth}>Obnovit šířky</Button>
            <Button onClick={resetColumnsOrder}>Obnovit pořadí</Button>
          </Group>
          <Stack style={{ flexWrap: 'wrap' }}
          w={'fit-content'}
            onChange={columnsToggleSettingsSwitchesWrapperOnChange}>
            {columnsToggle.filter(c => c.toggleable).map((c,i) => {
              return (
                <Group key={`toggle-col-${i}`}>
                  <Text>{columnAccessorToTitle(c.accessor)}</Text>
                  <Switch defaultChecked={c.toggled} data-columnaccesor={c.accessor} />
                </Group>
              );
            })}
          </Stack>
        </Stack>
      </ModalCmp>
      <ModalCmp
        opened={orderByModal[0]}
        onClose={orderByModal[1].close}
        withCloseButton>
        <Stack>
         {sorting.value !== undefined && <MultiColSortCmp
         //@ts-expect-error Typescript could not infer that sorting is not undefined
            values={sorting}
            columns={validOrderByCols}
          />}
        </Stack>
      </ModalCmp>
      <ModalCmp
      opened={filterSettingsModal[0]}
      onClose={filterSettingsModal[1].close}
      withinPortal={false}
      withCloseButton>
         <Group w={'100%'} justify={'center'}>
            <SearchableMultiSelect
              options={createInfo?.tags ?? []}
              onChange={setTags}
              value={actualTags}
              required
              label={'Štítky'}
            />
          </Group>
            <Stack w={'100%'} align={'center'}>
          <ListRangeCmp
            label={'Rozsah obtížnosti'}
            {...actualDifficultyRange}
            options={difficultiesForCmp ?? []}
            onChange={setDifficultyRange}
          />
          <ListRangeCmp
            label={'Rozsah tříd'}
            {...actualClassRange}
            options={classesForCmp ?? []}
            onChange={setClassRange}
          />
           <DateTimeRangeInputCmp
          fromLabel={'Vytvořeno od'}
          toLabel={'Vytvořeno do'}
          fromValue={actualCreationRange.min}
          toValue={actualCreationRange.max}
          onChange={onCreationRangeChange}
          />
          <DateTimeRangeInputCmp
          fromLabel={'Změněno od'}
          toLabel={'Změněno do'}
          fromValue={actualModificationRange.min}
          toValue={actualModificationRange.max}
          onChange={onModificationRangeChange}
          />
          </Stack>
      </ModalCmp>
    </>
  )
};

export { MyTaskList, type Props as MyTaskListProps };

