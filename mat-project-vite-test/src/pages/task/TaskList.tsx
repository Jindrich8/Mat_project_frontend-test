/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataTableColumn, useDataTableColumns } from "mantine-datatable";
import React, { FC, useEffect } from "react"
import { listTasks } from "../../api/task/list/get";
import { createAuthApiController } from "../../components/Auth/auth";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { Button, Group, Modal, Pill, PillGroup, Stack, Switch, Text, TextInput } from "@mantine/core";
import { AuthorInfo, EnumElement, OrderedEnumElement } from "../../api/dtos/success_response";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { TagsCmp } from "../../components/Tags/TagsCmp";
import { EyeIconCmp } from "../../components/Icons/EyeIconCmp";
import { ListRangeCmp } from "../../components/ListRange/ListRangeCmp";
import { getTaskCreateInfo } from "../../api/task/createInfo/createInfo";
import { SearchableMultiSelect } from "../../components/SearchableMultiSelect/SearchableMultiSelect";
import { arrayLast, dump, nundef, setSearchParam, tryStrToNum } from "../../utils/utils";
import { useListRange } from "../../components/ListRange/ListRangeType";
import { useHookstate } from "@hookstate/core";
import { ListTasksRequest } from "../../api/dtos/request";
import { UnionToTuple } from "../../types/base";
import { ErrorResponseState } from "../../types/types";
import { PERCENTAGE_PRECISION } from "../../task/review/Review";
import { ActionIconCmp } from "../../components/ActionIcon/ActionIconCmp";
import { useDisclosure } from "@mantine/hooks";
import { RestoreIconCmp } from "../../components/Icons/RestoreIconCmp";
import { AdjustmentsIconCmp } from "../../components/Icons/AdjustmentsIconCmp";
import { MultiColSortCmp } from "../../components/MultiColSort/MultiColSortCmp";
import { ArrowSortIconCmp } from "../../components/Icons/ArrowSortIconCmp";
import { FilterSettingsIconCmp } from "../../components/Icons/FilterSettingsIconCmp";
import { DataTableCmp, DataTableCmpProps } from "../../components/DataTable/DataTableCmp";
import { PlayerPlayIconCmp } from "../../components/Icons/PlayerPlayIconCmp";

interface Props {

}

type Rec = {
  id: string,
  name: string,
  difficulty: OrderedEnumElement,
  minClass: OrderedEnumElement,
  maxClass: OrderedEnumElement,
  tags: EnumElement[],
  taskReview?: { id: string, score: number },
  author: AuthorInfo
};
const basicColProps = { draggable: true, resizable: true };

const rowIdPrefix = 'task-row-';
const key = 'task-list-resizable-columns';
const limit = 50;
const listTasksControl = createAuthApiController();

const taskCreateInfoControl = createAuthApiController();

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

const validOrderByColsSet = {
  "name": true,
  "difficulty": true,
  "class_range": true,
} satisfies Record<string, true>;

//@ts-expect-error Object.keys does not infer properties type
const validOrderByCols: UnionToTuple<keyof typeof validOrderByColsSet> = Object.keys(validOrderByColsSet);


const columnAccessorToTitleDict: Record<string, string> = {
  'id': 'ID',
  'name': "Name",
  'difficulty': "Difficulty",
  'minClass': "Min class",
  'maxClass': "Max class",
  'tags': "Tags",
  'taskReview': "Task review",
  'author': "Author",
};

const columnAccessorToTitle = (accessor: string) => {
  return columnAccessorToTitleDict[accessor] ?? accessor;
}

const columnAccessorAndTitle = (accessor: string) => {
  return {
    title: columnAccessorToTitle(accessor),
    accessor: accessor
  };
}


const TaskList: FC<Props> = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const [createInfo, setCreateInfo] = React.useState<{
    tags: Array<{ value: string, label: string }>,
    sortedDifficulties: Array<{ orderedId: number, name: string }>,
    sortedClasses: Array<{ orderedId: number, name: string }>
  } | undefined>(undefined);

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

  console.log("Rerendering TaskListCmp");
  const [page, setPage] = React.useState<
    {
      records?: Rec[] | undefined,
      nextCursor?: string,
      prevCursor?: string
    } | undefined>(undefined);

  const [name, setName] = React.useState<string | null | undefined>(searchParams.get('name') ?? undefined);

  const [tags, setTags] = React.useState<string[] | null | undefined>(emptyArrayToUndef(searchParams.getAll('tags[]')));

  const navigateToTaskDetail = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
    e.stopPropagation(); // prevent
    const id = e.currentTarget.dataset['id'];
    navigate(`/task/${id}/detail`);
  }, [navigate]);

  const navigateToTaskTake = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
    e.stopPropagation(); // prevent
    const id = e.currentTarget.dataset['id'];
    navigate(`/task/${id}/take`);
  }, [navigate]);

  

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
          return (<Text w={'min-content'} m={'auto'}>{record.name}</Text>);
        },
      } as const,
      {
        ...columnAccessorAndTitle('difficulty'),
        toggleable: true,
        ...basicColProps,
        render: (_record, _index) => {
          const difficulty = _record.difficulty;
          return (<Text w={'min-content'} m={'auto'}>{difficulty.name}</Text>)
        }
      } as const,
      {
        ...columnAccessorAndTitle('minClass'),
        toggleable: true,
        ...basicColProps,
        render: (_record, _index) => {
          return (<Text w={'min-content'} m={'auto'}>{_record['minClass']['name']}</Text>);
        }
      } as const,
      {
        ...columnAccessorAndTitle('maxClass'),
        toggleable: true,
        ...basicColProps,
        render: (_record, _index) => {
          return (<Text w={'min-content'} m={'auto'}>{_record['maxClass']['name']}</Text>);
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
        ...columnAccessorAndTitle('taskReview'),
        toggleable: true,
        ...basicColProps,
        render: (_record, _index) => {
          const review = _record.taskReview;
          return (review ? <Link to={`/task/review/${review.id}/show`}>{'~' + (review.score * 100).toFixed(PERCENTAGE_PRECISION) + '%'}</Link> : '-');
        }
      } as const,
      {
        ...columnAccessorAndTitle('author'),
        toggleable: true,
        ...basicColProps,
        render: (_record, _index) => {
          return (<Text w={'min-content'} m={'auto'}>{_record.author.name}</Text>);
        }
      } as const,
      {
        title: 'Row Actions',
        accessor: '#',
        draggable: false,
        resizable: false,
        render: (_record, _index) => {
          return (<Group wrap={'nowrap'}>
            <ActionIconCmp
              data-id={_record.id}
              onClick={navigateToTaskTake}
              title={'Take task'}
            >
              <PlayerPlayIconCmp />
            </ActionIconCmp>
            <ActionIconCmp
              data-id={_record.id}
              onClick={navigateToTaskDetail}
              title={'Show detail'}
            >
              <EyeIconCmp />
            </ActionIconCmp>
          </Group>);
        }
      } as const
    ] satisfies DataTableColumn<Rec>[]
  }), [navigateToTaskDetail, navigateToTaskTake]);

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
  }, [setSearchParams])

  const fetchRecords = React.useCallback(async () => {
    console.log('Changing fetch records');
    if (createInfo) {
      console.log('Actual fetch records');
      const difficultyRange = getNumRangeParam(searchParams, 'Difficulty');
      const classRange = getNumRangeParam(searchParams, 'Class');
      const orderBy = searchParams.getAll('sort[]')?.map(o => {
        const obj = orderByParamToObj(o);
        return {
          filter_name: validOrderByCols[obj.ci] ?? '',
          type: obj.dir
        };
      }).filter(o => validOrderByColsSet[o.filter_name] ?? false) as ListTasksRequest['order_by'];
      console.log("ORDER BY TO API");
      console.debug(orderBy);
      const response = await listTasks({
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
          }
        },
        order_by: orderBy
      }, listTasksControl);
      if (response.success) {
        const data = response.body.data;
        setPage({
          prevCursor: data.config.prev_cursor,
          nextCursor: data.config.next_cursor,
          records: data.tasks.map(t => ({
            id: t.id,
            name: t.name,
            minClass: t.class_range.min,
            maxClass: t.class_range.max,
            tags: t.tags,
            taskReview: t.task_review,
            author: t.author,
            difficulty: t.difficulty
          }))
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
    setRangeParamIfNotUndef(params, 'Class', classRange);
    setRangeParamIfNotUndef(params, 'Difficulty', difficultyRange);
    if (sorting.value !== undefined && sorting.value.length > 0) {
      console.debug('Filter sort: ', sorting.value);
      setSearchParam(params, 'sort[]', sorting.value.map(v => serializeOrderByObj(v.ci, v.dir)));
    }

    setSearchParams(params);
  }, [classRange, difficultyRange, name, setSearchParams, sorting.value, tags]);

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
        <Text>Sorting: </Text>
        {sorting.value?.map((v,i) => {
          const label = validOrderByCols[v.ci];
          return (
            <PillGroup key={i} gap={'xs'}><Pill>{label}</Pill><Pill>{v.dir}</Pill></PillGroup>
          );
        })}
      </Group>
      <Group ml={'auto'}>
        <ActionIconCmp title={'Filter'} hiddenFrom={'md'} onClick={filterSettingsModal[1].open} >
          <FilterSettingsIconCmp />
        </ActionIconCmp>
        <ActionIconCmp title={'Sorting'} onClick={orderByModal[1].open}>
          <ArrowSortIconCmp />
        </ActionIconCmp>
        <ActionIconCmp title={'Adjust columns'} onClick={columnsToggleSettingsModal[1].open}>
          <AdjustmentsIconCmp />
        </ActionIconCmp>
        </Group>
      </Group>);
  }, [columnsToggleSettingsModal, filterSettingsModal, orderByModal, sorting.value]);


  const firstRowId = page?.records ? (page.records.at(0)?.id ?? null) : undefined;
  return (
    <>
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
              label={'Name'}
              value={actualName}
              onChange={onNameChange}
            />
            <SearchableMultiSelect
              options={createInfo?.tags ?? []}
              onChange={setTags}
              value={actualTags}
              required
              visibleFrom={'md'}
              label={'Tags'}
            />
          </Group>
        <Stack visibleFrom={'md'}>
          <ListRangeCmp
            label={'Difficulty range'}
            {...actualDifficultyRange}
            options={difficultiesForCmp ?? []}
            onChange={setDifficultyRange}
          />
          <ListRangeCmp
            label={'Class range'}
            {...actualClassRange}
            options={classesForCmp ?? []}
            onChange={setClassRange}
          />
    </Stack>
        </Stack>
        <Button w={'fit-content'} onClick={filter}>Filter</Button>
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
      <Modal
        opened={columnsToggleSettingsModal[0]}
        onClose={columnsToggleSettingsModal[1].close}
        withinPortal={false}
        lockScroll={false}
        styles={{content:{maxHeight:'85vh'}}}
        withCloseButton>
        <Stack mih={'fit-content'} mah={'80vh'}>
          <Group mah={'30vh'}>
            <ActionIconCmp title={'Restore colums toggle'} onClick={resetColumnsToggle}>
              <RestoreIconCmp />
            </ActionIconCmp>
            <Button onClick={resetColumnsWidth}>Reset width</Button>
            <Button onClick={resetColumnsOrder}>Reset order</Button>
          </Group>
          <Stack style={{ flexWrap: 'wrap' }}
          mah={'50vh'}
            onChange={columnsToggleSettingsSwitchesWrapperOnChange}>
            {columnsToggle.filter(c => c.toggleable).map((c,i) => {
              return (
                <Group key={`toggle-col-${i}`} w={'fit-content'}>
                  <Text>{columnAccessorToTitle(c.accessor)}</Text>
                  <Switch defaultChecked={c.toggled} data-columnaccesor={c.accessor} />
                </Group>
              );
            })}
          </Stack>
        </Stack>
      </Modal>
      <Modal
        opened={orderByModal[0]}
        onClose={orderByModal[1].close}
        w={'100%'}
        m={0}
        p={0}
        withCloseButton>
        <Stack w={'100%'} align={'center'}>
          {sorting.value !== undefined && <MultiColSortCmp
          //@ts-expect-error Typescript could not infer that sorting is not undefined
            values={sorting}
            columns={validOrderByCols}
          />}
        </Stack>
      </Modal>
      <Modal
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
              label={'Tags'}
            />
          </Group>

          <ListRangeCmp
            label={'Difficulty range'}
            {...actualDifficultyRange}
            options={difficultiesForCmp ?? []}
            onChange={setDifficultyRange}
          />
          <ListRangeCmp
            label={'Class range'}
            {...actualClassRange}
            options={classesForCmp ?? []}
            onChange={setClassRange}
          />
      </Modal>
    </>
  )
};

export { TaskList, type Props as TaskListProps };

