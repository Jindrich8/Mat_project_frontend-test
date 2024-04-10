import { DataTableColumn, useDataTableColumns } from "mantine-datatable";
import React, { FC, useEffect } from "react"
import { createAuthApiController } from "../../components/Auth/auth";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { Button, Group, Pill, PillGroup, RangeSliderProps, Stack, Switch, Text, TextInput } from "@mantine/core";
import { AuthorInfo1, EnumElement, OrderedEnumElement } from "../../api/dtos/success_response";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TagsCmp } from "../../components/Tags/TagsCmp";
import { EyeIconCmp } from "../../components/Icons/EyeIconCmp";
import { ListRangeCmp } from "../../components/ListRange/ListRangeCmp";
import { getTaskCreateInfo } from "../../api/task/createInfo/createInfo";
import { SearchableMultiSelect } from "../../components/SearchableMultiSelect/SearchableMultiSelect";
import { arrayLast, dump, nundef, setSearchParam, tryStrToNum, utcStrTimestampToLocalStr } from "../../utils/utils";
import { useListRange } from "../../components/ListRange/ListRangeType";
import { useHookstate } from "@hookstate/core";
import { ListTaskReviewsRequest } from "../../api/dtos/request";
import { ErrorResponseState } from "../../types/types";
import { ActionIconCmp } from "../../components/ActionIcon/ActionIconCmp";
import { useDisclosure } from "@mantine/hooks";
import { RestoreIconCmp } from "../../components/Icons/RestoreIconCmp";
import { AdjustmentsIconCmp } from "../../components/Icons/AdjustmentsIconCmp";
import { MultiColSortCmp } from "../../components/MultiColSort/MultiColSortCmp";
import { ArrowSortIconCmp } from "../../components/Icons/ArrowSortIconCmp";
import { FilterSettingsIconCmp } from "../../components/Icons/FilterSettingsIconCmp";
import { DataTableCmp, DataTableCmpProps } from "../../components/DataTable/DataTableCmp";
import { listTaskReviews } from "../../api/task/review/get";
import { TrashIconCmp } from "../../components/Icons/TrashIconCmp";
import { deleteReview as apiDeleteReview } from "../../api/task/review/delete";
import { SuccessAlertCmp } from "../../components/SuccessAlert/SuccessAlertCmp";
import { DateTimeRangeInputCmp } from "../../components/DateTimeRangeInput/DateTimeRangeInputCmp";
import { DateValue } from "@mantine/dates";
import { PercentRangeSliderCmp } from "../../components/PercentRangeSlider/PercentRangeSliderCmp";
import { PlayerPlayIconCmp } from "../../components/Icons/PlayerPlayIconCmp";
import { ModalCmp } from "../../components/Modal/ModalCmp";

interface Props {

}

/*
            id: t.id,
            score:t.score,
            evaluation_timestamp:t.evaluation_timestamp,
            name: t.task_preview_info.name,
            minClass: t.task_preview_info.class_range.min,
            maxClass: t.task_preview_info.class_range.max,
            tags: t.task_preview_info.tags,
            author: t.task_preview_info.author,
            difficulty: t.task_preview_info.difficulty
*/
type Rec = {
  id: string,
  score:number,
  evaluationTimestamp:string,
  name: string,
  difficulty: OrderedEnumElement,
  minClass: OrderedEnumElement,
  maxClass: OrderedEnumElement,
  tags: EnumElement[],
  author: AuthorInfo1
};
const basicColProps = { draggable: true, resizable: true };

const rowIdPrefix = 'task-row-';
const key = 'review-list-resizable-columns';
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


const apiValidOrderByCols = ["name","difficulty","class_range","evaluation_timestamp","score"] as const;
const validOrderByCols = ["Název","Obtížnost","Rozsah tříd","Datum a čas vyhodnocení","Skóre"] as const;


/*
            id: t.id,
            score:t.score,
            evaluation_timestamp:t.evaluation_timestamp,
            name: t.task_preview_info.name,
            minClass: t.task_preview_info.class_range.min,
            maxClass: t.task_preview_info.class_range.max,
            tags: t.task_preview_info.tags,
            author: t.task_preview_info.author,
            difficulty: t.task_preview_info.difficulty
*/
const columnAccessorToTitleDict: Record<string, string> = {
  'id': 'ID',
  'name': "Název",
  'evaluationTimestamp': 'Datum a čas vyhodnocení',
  'difficulty': "Obtížnost",
  'minClass': "Min. třída",
  'maxClass': "Max. třída",
  'tags': "Štítky",
  'score' : "Skóre",
  'author': "Autor",
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

const deleteTaskReviewControl = createAuthApiController();

const ReviewList: FC<Props> = () => {

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

  console.log("Rerendering ReviewListCmp");
  const [page, setPage] = React.useState<
    {
      records?: Rec[] | undefined,
      nextCursor?: string,
      prevCursor?: string
    } | undefined>(undefined);

  const [name, setName] = React.useState<string | null | undefined>(searchParams.get('name') ?? undefined);

  const [tags, setTags] = React.useState<string[] | null | undefined>(emptyArrayToUndef(searchParams.getAll('tags[]')));

  const [scoreRange,setScoreRange] = React.useState<{
    min?:number,
    max?:number
  }>({
  });

  const onScoreRangeChange = React.useCallback<NonNullable<RangeSliderProps['onChange']>>((value) =>{
    setScoreRange({
        min:value[0] === 0 ? 0 : value[0],
        max:value[1] === 100 ? 100 : value[1]
    });
  },[]);

  const navigateToReviewDetail = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
    e.stopPropagation(); // prevent
    const id = e.currentTarget.dataset['id'];
    navigate(`/task/review/${id}/detail`);
  }, [navigate]);

  const navigateToShowReview = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
    e.stopPropagation(); // prevent
    const id = e.currentTarget.dataset['id'];
    navigate(`/task/review/${id}/show`);
  }, [navigate]);

  const deleteReview = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>(async(e) => {
    e.stopPropagation(); // prevent
    const id = e.currentTarget.dataset['id'];
    const index = e.currentTarget.dataset['index'];
    if(id !== undefined && index !== undefined){
      const numIndex = Number(index);
    const response = await apiDeleteReview(id,deleteTaskReviewControl);
    if(response.success){
      setSuccessAlert({
        message: `Vyhodnocení s id '${id}' bylo úspěšně smazáno.`
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
        ...basicColProps,
        toggleable:true,
        render(record) {
          return (<Text w={'fit-content'} m={'auto'}>{record.name}</Text>);
        },
      } as const,
     {
        ...columnAccessorAndTitle('score'),
        ...basicColProps,
        toggleable:true,
        render(record) {
            const score = record.score;
          return (<Text w={'fit-content'} m={'auto'}>{(score * 100).toFixed(2)+'%'}</Text>);
        },
     },
      {
        ...columnAccessorAndTitle('difficulty'),
        toggleable: true,
        ...basicColProps,
        render: (_record) => {
          const difficulty = _record.difficulty;
          return (<Text w={'fit-content'} m={'auto'}>{difficulty.name}</Text>)
        }
      } as const,
      {
        ...columnAccessorAndTitle('minClass'),
        toggleable: true,
        ...basicColProps,
        render: (_record) => {
          return (<Text w={'fit-content'} m={'auto'}>{_record['minClass']['name']}</Text>);
        }
      } as const,
      {
        ...columnAccessorAndTitle('maxClass'),
        toggleable: true,
        ...basicColProps,
        render: (_record) => {
          return (<Text w={'min-content'} m={'auto'}>{_record['maxClass']['name']}</Text>);
        }
      } as const,
      {
        ...columnAccessorAndTitle('tags'),
        toggleable: true,
        ...basicColProps,
        noWrap: true,
        render: (_record) => {
          const tags = _record['tags'];
          return (<TagsCmp tags={tags.map(tag => tag.name)} />);
        }
      } as const,
      {
        ...columnAccessorAndTitle('evaluationTimestamp'),
        toggleable: true,
        ...basicColProps,
        render: (_record) => {
          const timestamp = _record.evaluationTimestamp;
          return (<Text>{timestamp}</Text>);
        }
      } as const,
      {
        ...columnAccessorAndTitle('author'),
        toggleable: true,
        ...basicColProps,
        render: (_record) => {
          return (<Text w={'min-content'} m={'auto'}>{_record.author.name}</Text>);
        }
      } as const,
      {
        title: 'Akce',
        accessor: '#',
        toggleable: false,
        draggable: false,
        resizable: false,
        render: (_record, _index) => {
          return (<Group wrap={'nowrap'}>
            <ActionIconCmp
              data-id={_record.id}
              onClick={navigateToShowReview}
              title={'Zobrazit vyhodnocení'}
            >
              <PlayerPlayIconCmp />
            </ActionIconCmp>
            <ActionIconCmp
              data-id={_record.id}
              onClick={navigateToReviewDetail}
              title={'Zobrazit detail vyhodnocení'}
            >
              <EyeIconCmp />
            </ActionIconCmp>
            <ActionIconCmp
              data-index={_index}
              data-id={_record.id}
              onClick={deleteReview}
              title={'Smazat vyhodnocení'}
            >
              <TrashIconCmp />
            </ActionIconCmp>
          </Group>);
        }
      } as const
    ] satisfies DataTableColumn<Rec>[]
  }), [deleteReview, navigateToReviewDetail, navigateToShowReview]);

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
      const scoreRange = getNumRangeParam(searchParams, 'Score');
      const orderBy:NonNullable<ListTaskReviewsRequest['order_by']> = [];
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
      const response = await listTaskReviews({
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
          evaluation_timestamp_range:{
            min: getTimestampParam(searchParams,'evaluatedFrom'),
            max: getTimestampParam(searchParams,'evaluatedTill')
          },
          score_range:{
            min: scoreRange[0],
            max: scoreRange[1]
          }
        },
        order_by: orderBy
      }, listTasksControl);
      if (response.success) {
        const data = response.body.data;
        setPage({
          prevCursor: data.config.prev_cursor,
          nextCursor: data.config.next_cursor,
          records: data.reviews.map(t => {
            return ({
            id: t.id,
            score:t.score,
            evaluationTimestamp:utcStrTimestampToLocalStr(t.evaluation_timestamp),
            name: t.task_preview_info.name,
            minClass: t.task_preview_info.class_range.min,
            maxClass: t.task_preview_info.class_range.max,
            tags: t.task_preview_info.tags,
            author: t.task_preview_info.author,
            difficulty: t.task_preview_info.difficulty
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

  const [classRange,classRangeErrors, setClassRange] = useListRange(
    classesForCmp ?? [],
    ...getNumRangeParam(searchParams, 'Class')
  );
  const [difficultyRange,difficultyRangeErrors, setDifficultyRange] = useListRange(
    difficultiesForCmp ?? [],
    ...getNumRangeParam(searchParams, 'Difficulty')
  );

  const actualTags = React.useMemo(() => nundef(tags, searchParams.getAll('tags')) ?? [],
    [searchParams, tags]
  );

  const [evaluatedFrom,setEvaluatedFrom] = React.useState<DateValue|undefined>(getDateParam(searchParams, 'evaluatedFrom'));
  const [evaluatedTill,setEvaluatedTill] = React.useState<DateValue|undefined>(getDateParam(searchParams, 'evaluatedTill'));

  const actualEvaluationRange = {
    min: nundef(evaluatedFrom,getDateParam(searchParams, 'evaluatedFrom')) ?? null,
    max: nundef(evaluatedTill,getDateParam(searchParams,'evaluatedTill')) ?? null
  };

  const onEvaluationRangeChange = React.useCallback((type:'from'|'to',value:DateValue) => {
    if(type === 'from'){
      setEvaluatedFrom(value);
    }
    else{
      setEvaluatedTill(value);
    }
  },[]);

  const actualDifficultyRange = {
    min: nundef(difficultyRange.min, tryStrToNum(searchParams.get('minDifficulty'), undefined)) ?? undefined,
    max: nundef(difficultyRange.max, tryStrToNum(searchParams.get('maxDifficulty'), undefined)) ?? undefined,
    minError: difficultyRangeErrors.minError,
    maxError: difficultyRangeErrors.maxError
  };

  console.log(`Search params: ${JSON.stringify([...searchParams])}`);

  const actualClassRange = {
    min: nundef(classRange.min, tryStrToNum(searchParams.get('minClass'), undefined)) ?? undefined,
    max: nundef(classRange.max, tryStrToNum(searchParams.get('maxClass'), undefined)) ?? undefined,
    minError: classRangeErrors.minError,
    maxError: classRangeErrors.maxError
  };



  const actualScoreRange = React.useMemo(()=>{
    const score = [
        nundef(scoreRange.min, tryStrToNum(searchParams.get('minScore'), undefined)) ?? 0,
        nundef(scoreRange.max, tryStrToNum(searchParams.get('maxScore'), undefined)) ?? 100
      ] as const;
      return score;
  },[scoreRange.max, scoreRange.min, searchParams]);

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
      if (evaluatedFrom != null) {
          setSearchParam(params, 'evaluatedFrom', serializeDate(evaluatedFrom));
      }
      if (evaluatedTill != null) {
          setSearchParam(params, 'evaluatedTill', serializeDate(evaluatedTill));
      }
      setRangeParamIfNotUndef(params, 'Class', classRange);
      setRangeParamIfNotUndef(params, 'Difficulty', difficultyRange);
      if (sorting.value !== undefined && sorting.value.length > 0) {
          console.debug('Filter sort: ', sorting.value);
          setSearchParam(params, 'sort[]', sorting.value.map(v => serializeOrderByObj(v.ci, v.dir)));
      }
    setRangeParamIfNotUndef(params, 'Score', scoreRange);

    setSearchParams(params);
  }, [classRange, difficultyRange, evaluatedFrom, evaluatedTill, name, scoreRange, setSearchParams, sorting.value, tags]);

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
        <ActionIconCmp title={'Filter'} hiddenFrom={'md'} onClick={filterSettingsModal[1].open} >
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
          <PercentRangeSliderCmp
          //@ts-expect-error actualScoreRange cannot be assigned to mutable type
            value={actualScoreRange}
            onChange={onScoreRangeChange}
             />
        <Stack visibleFrom={'md'} mt={'lg'}>
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
          fromLabel={'Vyhodnoceno od'}
          toLabel={'Vyhodnoceno do'}
          fromValue={actualEvaluationRange.min}
          toValue={actualEvaluationRange.max}
          onChange={onEvaluationRangeChange}
          />
    </Stack>
        </Stack>
        <Button w={'fit-content'} onClick={filter} mt={'lg'} mb={'md'}>Filtrovat</Button>
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
      </ModalCmp>
    </>
  )
};

export { ReviewList, type Props as ReviewListProps };

