/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataTable, DataTableColumn, DataTableProps, useDataTableColumns } from "mantine-datatable";
import React, { FC, useEffect } from "react"
import { listTasks } from "../../api/task/list/get";
import { createAuthApiController } from "../../components/Auth/auth";
import { useErrorResponse } from "../../utils/hooks";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { ActionIcon, Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { AuthorInfo, EnumElement, OrderedEnumElement } from "../../api/dtos/success_response";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { TagsCmp } from "../../components/Tags/TagsCmp";
import { EyeIconCmp } from "../../components/Icons/EyeIconCmp";
import { ListRangeCmp } from "../../components/ListRange/ListRangeCmp";
import { getTaskCreateInfo } from "../../api/task/createInfo/createInfo";
import { SearchableMultiSelect } from "../../components/SearchableMultiSelect/SearchableMultiSelect";
import { arrayLast, nundef, setSearchParam, tryStrToNum } from "../../utils/utils";
import { useListRange } from "../../components/ListRange/ListRangeType";

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

const setRangeParamIfNotUndef = <T,>(params:URLSearchParams,keyBase:string,range:{
  min?:T,
  max?:T,
  [other:PropertyKey]:unknown
}) =>{
  if(range.min !== undefined){
  setSearchParam(params,'min'+ keyBase,range.min?.toString() ?? undefined);
  }
  if(range.max !== undefined){
  setSearchParam(params,'max'+ keyBase,range.max?.toString() ?? undefined);
  }
};

const getNumRangeParam = (params:URLSearchParams,keyBase:string) => {
  return [
    tryStrToNum(params.get('min'+keyBase),undefined) ?? undefined,
  tryStrToNum(params.get('max'+keyBase),undefined) ?? undefined
] as const;
  
};

const emptyArrayToUndef = <T,>(arr:T[]) =>{
  return arr.length === 0 ? undefined : arr;
};

const setUrlHashToFirstVisibleRowId = async (tableBody:HTMLTableSectionElement,yPos:number,viewPort:HTMLDivElement) => {
  const trs= [...tableBody.querySelectorAll('tr')];
  let firstVisibleTr = null;
  for(const tr of trs) {
    if(tr.offsetTop + tr.offsetHeight >= yPos){
      firstVisibleTr = tr;
      break;
    }
  }
  const id = firstVisibleTr?.id;
  if (id) {
    const newHash = '#'+id;
    if(document.location.hash !== newHash){
    const href = document.location.href;
    const hashIndex = href.indexOf('#');
    const hrefNoHash = hashIndex >= 0 ? href.substring(0, hashIndex) : href;
    history.replaceState(history.state,'',hrefNoHash+newHash);
    }
  }
};

const TaskList: FC<Props> = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const cursor = React.useMemo(() => (searchParams.get('cursor') ?? undefined), [searchParams]);

  const hash = React.useRef<string>('');

  const [createInfo, setCreateInfo] = React.useState<{
    tags: Array<{ value: string, label: string }>,
    sortedDifficulties: Array<{ orderedId: number, name: string }>,
    sortedClasses: Array<{ orderedId: number, name: string }>
  } | undefined>(undefined);

  const [error, setError] = useErrorResponse();
  const clearError = React.useCallback(() => setError(undefined), [setError]);

  const tableBodyRef = React.useRef<HTMLTableSectionElement>(null);

  const tableScrollViewportRef = React.useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const locationHash = document.location.hash;
    hash.current = locationHash ? locationHash.substring(1) : locationHash;
  },[]);

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

  const [name,setName] = React.useState<string|null|undefined>(searchParams.get('name') ?? undefined);

  const [tags,setTags] = React.useState<string[]|null|undefined>(emptyArrayToUndef(searchParams.getAll('tags[]')));

  const navigateToTaskDetail = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
    e.stopPropagation(); // prevent
    const id = e.currentTarget.dataset['id'];
    navigate(`/task/${id}/detail`);
  }, [navigate]);



  const { effectiveColumns, resetColumnsWidth } = useDataTableColumns({
    key, columns: [
      {
        title: 'ID',
        accessor: 'id',
        ...basicColProps
      } as const,
      {
        title: 'Name',
        accessor: 'name',
        ...basicColProps,
        render(record, index) {
          return (<Text w={'min-content'} m={'auto'}>{record.name}</Text>);
        },
      } as const,
      {
        title: 'Difficulty',
        accessor: 'difficulty',
        ...basicColProps,
        render: (_record, _index) => {
          const difficulty = _record.difficulty;
          return (<Text w={'min-content'} m={'auto'}>{difficulty.name}</Text>)
        }
      } as const,
      {
        title: 'Min class',
        accessor: 'minClass',
        ...basicColProps,
        render: (_record, _index) => {
          return (<Text w={'min-content'} m={'auto'}>{_record['minClass']['name']}</Text>);
        }
      } as const,
      {
        title: 'Max class',
        accessor: 'maxClass',
        ...basicColProps,
        render: (_record, _index) => {
          return (<Text w={'min-content'} m={'auto'}>{_record['maxClass']['name']}</Text>);
        }
      } as const,
      {
        title: 'Tags',
        accessor: 'tags',
        ...basicColProps,
        noWrap: true,
        render: (_record, _index) => {
          const tags = _record['tags'];
          return (<TagsCmp tags={tags.map(tag => tag.name)} />);
        }
      } as const,
      {
        title: 'Task review',
        accessor: 'taskReview',
        ...basicColProps,
        render: (_record, _index) => {
          const review = _record.taskReview;
          return (review ? <Link to={'/task/review/' + review.id}>{review.score}</Link> : '-');
        }
      } as const,
      {
        title: 'Author',
        accessor: 'author',
        ...basicColProps,
        render: (_record, _index) => {
          return (<Text w={'min-content'} m={'auto'}>{_record.author.name}</Text>);
        }
      } as const,
      {
        title: 'Row Actions',
        accessor: '#',
        ...basicColProps,
        draggable: false,
        render: (_record, _index) => {
          return (<Group wrap={'nowrap'}>
            <ActionIcon data-id={_record.id} onClick={navigateToTaskDetail} aria-label={'Show detail'}>
              <EyeIconCmp />
            </ActionIcon>
          </Group>);
        }
      } as const
    ] satisfies DataTableColumn<Rec>[]
  });

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

  const fetchRecords = React.useCallback(async (cursor?: string) => {
    console.log('Changing fetch records');
    if (createInfo) {
      const difficultyRange = getNumRangeParam(searchParams,'Difficulty');
      const classRange = getNumRangeParam(searchParams,'Class');
      const response = await listTasks({
        limit: limit,
        order_by: [],
        filters: {
          name: searchParams.get('name') ?? undefined,
          tags: searchParams.getAll('tags[]') ?? undefined,
          difficulty_range: {
              min: Number((difficultyRange[0] ?? createInfo.sortedDifficulties[0].orderedId)),
              max: Number((difficultyRange[1] ?? arrayLast(createInfo.sortedDifficulties).orderedId))
            },
          class_range:{
              min: Number((classRange[0] ?? createInfo.sortedClasses[0].orderedId)),
              max: Number((classRange[1] ?? arrayLast(createInfo.sortedClasses).orderedId))
            }
        },
        cursor: cursor ?? null
      }, listTasksControl);
      if (response.success) {
        const data = response.body.data;
        setCursor(cursor);
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
  }, [createInfo, searchParams, setCursor, setError]);

  const firstPage = React.useCallback(() => {
    setCursor(undefined);
  }, [setCursor]);

  const prevPage = React.useCallback(() => {
    setCursor(page?.prevCursor);
  }, [page?.prevCursor, setCursor]);

  const nextPage = React.useCallback(() => {
    setCursor(page?.nextCursor);
  }, [page?.nextCursor, setCursor]);

  const refetchCurrPage = React.useCallback(() => {
    fetchRecords(cursor);
  }, [cursor, fetchRecords]);



  useEffect(() => {
    console.log("Fetching records...");
    fetchRecords(cursor);
  }, [cursor, fetchRecords]);

  const onNameChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => setName(e.target.value),
     []);

  const difficultiesForCmp = React.useMemo(() => createInfo?.sortedDifficulties.map(d => d.name),
  [createInfo?.sortedDifficulties]);

const classesForCmp = React.useMemo(() => createInfo?.sortedClasses.map(c => c.name),
  [createInfo?.sortedClasses]);

  const [classRange,setClassRange] = useListRange(
    classesForCmp ?? [],
    ...getNumRangeParam(searchParams,'Class')
    );
  const [difficultyRange,setDifficultyRange] = useListRange(
    difficultiesForCmp ?? [],
    ...getNumRangeParam(searchParams,'Difficulty')
    );

  const actualTags = React.useMemo(()=>nundef(tags,searchParams.getAll('tags')) ?? undefined,
  [searchParams, tags]
  );

  const actualDifficultyRange = {
    min:nundef(difficultyRange.min,tryStrToNum(searchParams.get('minDifficulty'),undefined)) ?? undefined,
    max:nundef(difficultyRange.max,tryStrToNum(searchParams.get('maxDifficulty'),undefined)) ?? undefined,
    minError:difficultyRange.minError,
    maxError:difficultyRange.maxError
  };

  console.log(`Search params: ${JSON.stringify([...searchParams])}`);

  const actualClassRange = {
    min:nundef(classRange.min,tryStrToNum(searchParams.get('minClass'),undefined)) ?? undefined,
    max:nundef(classRange.max,tryStrToNum(searchParams.get('maxClass'),undefined)) ?? undefined,
    minError:classRange.minError,
    maxError:classRange.maxError
  };

  console.log(`actualDifficultyRange: ${JSON.stringify(actualDifficultyRange)}`);

  const actualName = nundef(name,searchParams.get('name')) ?? undefined;

  const filter = React.useCallback(() => {
    const params = new URLSearchParams();
    if (name !== undefined) {
      setSearchParam(params,'name',name ?? undefined);
    }
    if (tags !== undefined) {
      setSearchParam(params, 'tags[]', tags ?? undefined);
    }
    setRangeParamIfNotUndef(params,'Class',classRange);
    setRangeParamIfNotUndef(params,'Difficulty',difficultyRange);
    
    setSearchParams(params);
  }, [classRange, difficultyRange, name, setSearchParams, tags]);

  const customRowAttributes = React.useCallback<NonNullable<DataTableProps<Rec>['customRowAttributes']>>(
    (record,index) =>({
      id:rowIdPrefix+record.id
  }),[]);

  const prevTableScrollPos = React.useRef<{
    x:number,
    y:number
  }|null>(null);

  const onTableScroll = React.useCallback<NonNullable<DataTableProps<Rec>['onScroll']>>(
    async(pos) => {
      if (tableScrollViewportRef.current && prevTableScrollPos.current?.y !== pos.y) {
        const tableBody = tableBodyRef.current;
        if (tableBody) {
          setUrlHashToFirstVisibleRowId(tableBody,pos.y,tableScrollViewportRef.current);
        }
    }
    prevTableScrollPos.current = pos;
  },[]);

  useEffect(() => {
    if(page?.records !== undefined){
      if(window.location.hash !== '#'+hash.current){
        console.log("Changing hash");
      window.location.hash = hash.current;
      }
      console.log(`valus: ${JSON.stringify({
       tbref: tableBodyRef.current?.tagName,
       prevTbScroll:prevTableScrollPos.current,
       tbScView:tableScrollViewportRef.current?.tagName
      })}`);
      if(tableBodyRef.current && prevTableScrollPos.current !== null && tableScrollViewportRef.current){
        console.log("Changing scroll position");
        setUrlHashToFirstVisibleRowId(tableBodyRef.current,prevTableScrollPos.current.y,tableScrollViewportRef.current);
        }
    }
  },[page?.records])

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
          
        </Stack>
        <Button w={'fit-content'} onClick={filter}>Filter</Button>
      </Stack>
      <Group>
        <Button onClick={resetColumnsWidth}>Reset width</Button>
      </Group>
      <DataTable
      bodyRef={tableBodyRef}
      scrollViewportRef={tableScrollViewportRef}
        withColumnBorders
        withTableBorder
        height={'35rem'}
        storeColumnsKey={key}
        columns={effectiveColumns}
        fetching={page?.records === undefined}
        pinLastColumn
        onScroll={onTableScroll}
        customRowAttributes={customRowAttributes}
        records={page?.records} />
      <Group>
        <Button disabled={page?.prevCursor === undefined} onClick={firstPage}>First</Button>
        <Button disabled={page?.prevCursor === undefined} onClick={prevPage}>Previous</Button>
        <Button disabled={page?.nextCursor === undefined} onClick={nextPage}>Next</Button>
      </Group>
    </>
  )
};

export { TaskList, type Props as TaskListProps };

