import React, { FC, Suspense, lazy, useEffect, useState } from "react"
import { SearchableMultiSelect, SearchableMultiSelectProps } from "../../components/SearchableMultiSelect/SearchableMultiSelect";
import { EditorProps } from "@monaco-editor/react";
import { Box, Button, Checkbox, Group, Stack, Tabs, Text, TextInput } from "@mantine/core";
import { useHookstate } from "@hookstate/core";
import { ApplicationErrorInformation } from "../../api/dtos/errors/error_response";
import { getTaskCreateInfo } from "../../api/task/createInfo/createInfo";
import { SearchableSelect, SearchableSelectProps } from "../../components/SearchableSelectCmp";
import { ListRangeCmp, ListRangeCmpProps } from "../../components/ListRange/ListRangeCmp";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { ErrorAlertCmp } from "../../components/ErrorAlertCmp";
import { createAuthApiController } from "../../components/Auth/auth";
import { Any } from "../../types/types";
import { useListRange } from "../../components/ListRange/ListRangeType";
import styles from "./UpdateTaskPageCmpStyles.module.css";
import { LoaderCmp } from "../LoaderCmp";



type Resp<T, E> = {
    success: true,
    value: T
} | {
    success: false,
    value: E
};
type Err = {
    status: number,
    statusText: string,
    error?: ApplicationErrorInformation
};

type DeafultInfo = {
    name: string,
    orientation?: string,
    difficulty?: number,
    tags: string[],
    classRange: {
        min?: number,
        max?: number
    },
    isPublic: boolean
};

type TaskError = {
    status: number,
    statusText: string,
    error?: ApplicationErrorInformation
};

type FormError = {
    name?:string,
    display?:string,
    difficulty?:string,
    classRange?:{
        error?:string,
        minError?:string,
        maxError?:string
    },
    tags?:string
};

type GeneralError = {
    message: string,
    description?: string
};

interface Props {
    getInitialFilters?: () => DeafultInfo | Promise<Resp<DeafultInfo, Err>|void|undefined>,
    getInitialSource?: () => string | Promise<Resp<string, Err>|void|undefined>,
    actionLabel:string,
    action:(params:{
        name:string,
        display:'horizontal'|'vertical',
        tags:string[],
        source?:string,
        sourceChanged:boolean, 
        difficulty:number,
        classRange:{
        min:number,
        max:number
    },isPublic:boolean
}) => Promise<{generalError:true,value:GeneralError}|{generalError:false,
    value:{
        isFormError:false,
        error:TaskError
    }|{
        isFormError:true,
        error:FormError
    }
}|undefined>
}

const taskCreateInfoControl = createAuthApiController();

const NAME_MIN_LEN = 5;
const NAME_MAX_LEN = 50;

const UpdateTaskPageCmp: FC<Props> = ({ getInitialFilters, getInitialSource,action,actionLabel }) => {
    // const editor = useMonaco();
    const editorRef = React.useRef<Any>(null);
    const [XMLEditorCmp,setXMLEditorCmp] = React.useState<typeof import("../XMLEditor/XMLEditorCmp")['XMLEditorCmp']>();

    const sourceChanged = React.useRef<boolean>(false);
    console.log("Rerendering Create");
    const editorValue = React.useRef<string | undefined>(undefined);
    const generalError = useHookstate<GeneralError | undefined>(undefined);

    const clearGeneralError = React.useCallback(() => {
        generalError.set(undefined);
    }, [generalError]);


    const [taskError, setTaskError] = React.useState<TaskError | undefined>(undefined);

    const clearTaskError = React.useCallback(() => {
        setTaskError(undefined);
    }, [setTaskError]);

    const [createInfo, setCreateInfo] = useState<{
        tags: Array<{ value: string, label: string }>,
        difficulties: Array<{ value: string, label: string }>,
        sortedClasses: Array<{ orderedId: number, name: string }>
    } | undefined>(undefined);

    const classesForCmp = React.useMemo(() => {
        return createInfo?.sortedClasses.map(c => c.name)
    }, [createInfo]);

    const onEditorValueChange = React.useCallback<NonNullable<EditorProps['onChange']>>((value) => {
        editorValue.current = value;
        sourceChanged.current = true;
    }, []);

    const state = useHookstate({
        name: {
            val: '',
            err: undefined as (string | undefined)
        },
        orientation: {
            val: null as (string | null),
            err: undefined as (string | undefined)
        },
        difficulty: {
            val: null as (string | null),
            err: undefined as (string | undefined)
        },
        tags: {
            err: undefined as (string | undefined)
        },
        classRange: {
            err: undefined as (string|undefined),
            minError: undefined as (string|undefined),
            maxError: undefined as (string|undefined)
        },
        isPublic: false as boolean
    });

    const [classRange,classRangeErrors, setClassRange] = useListRange(classesForCmp ?? []);

    useEffect(() => {
        if (getInitialFilters) {
            const getValues = async () => {
                const valuesResp = getInitialFilters();
                let values = undefined;
                if (valuesResp instanceof Promise) {
                    const response = await valuesResp;
                    if (response) {
                        if (!response.success) {
                            const err = response.value;
                            setTaskError({
                                status: err.status,
                                statusText: err.statusText,
                                error: err.error
                            });
                        }
                        else {
                            values = response.value;
                        }
                    }
                }
                else {
                    values = valuesResp;
                }
                if (values) {
                    state.set({
                        name: {
                            val: values.name,
                            err: undefined
                        },
                        orientation: {
                            val: values.orientation ?? null,
                            err: undefined
                        },
                        difficulty: {
                            val: values.difficulty?.toString() ?? null,
                            err: undefined
                        },
                        tags: {
                            err: undefined
                        },
                        classRange: {
                            err: undefined,
                            minError: undefined,
                            maxError: undefined
                        },
                        isPublic: values.isPublic
                    });
                    setTags(values.tags);
                    setClassRange('min', values.classRange.min, values.classRange.max ?? null);
                }
            };
            getValues();
        }
        const fetchEditor = async () =>{
            if (editorValue.current === undefined) {
                setXMLEditorCmp(
                    lazy(() => import("../XMLEditor/XMLEditorCmp")
                .then(({ XMLEditorCmp }) => ({ default: XMLEditorCmp })))
                );
                if (getInitialSource) {
                    const sourceResp = getInitialSource();
                    let source = undefined;
                    if (sourceResp instanceof Promise) {
                        const response = await sourceResp;
                        if (response) {
                            if (!response.success) {
                                const err = response.value;
                                setTaskError({
                                    status: err.status,
                                    statusText: err.statusText,
                                    error: err.error
                                });
                            }
                            else {
                                source = response.value;
                            }
                        }
                    }
                    else {
                        source = sourceResp;
                    }
                    if (editorValue.current === undefined && source !== undefined) {
                        editorValue.current = source;
                        setDefaultSource(source);
                        editorRef.current?.setValue(source);
                    }
                }
                else {
                    editorValue.current = '';
                }
            }
        };
        fetchEditor();
        // disable is needed, because without it, it causes infinite loop (hookstate as dependency problems)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getInitialFilters, setClassRange]);


    

    const [tags, setTags] = React.useState<string[]>([]);


    useEffect(() => {
        const resizeListener = () => {
            editorRef.current?.layout({});
        };
        window.addEventListener('resize', resizeListener);
        const fetchCreateInfo = async () => {
            const response = await getTaskCreateInfo(null, taskCreateInfoControl);
            //  console.log('response: ' + JSON.stringify(response));
            if (response.success) {
                const data = response.body.data;
                console.log('data: ');
                console.log(JSON.stringify(data));
                setCreateInfo({
                    tags: data.tags.map(tag => ({ label: tag.name, value: tag.id + '' })),
                    difficulties: data.difficulties.map(diff => ({ label: diff.name, value: diff.orderedId + '' })),
                    sortedClasses: data.classes.map(c => ({ orderedId: c.orderedId, name: c.name }))
                        .sort((a, b) => a.orderedId - b.orderedId)
                });
            }
            else if (response.isServerError) {
                setTaskError(
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
        return () => {
            window.removeEventListener('resize', resizeListener);
        };
    }, [createInfo]);

    

    const onDifficultyChanged = React.useCallback<NonNullable<SearchableSelectProps['onChange']>>((option) => {
        state.difficulty.set({
            val: option?.value ?? null,
            err: undefined
        });
    }, [state.difficulty]);

    const onIsPublicChanged = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
        state.isPublic.set(e.target.checked);
    }, [state.isPublic]);

    const onNameChanged = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
        state.name.set({
            val: e.target.value,
            err: undefined
        });
    }, [state.name]);

    const onOrientationChanged = React.useCallback<NonNullable<SearchableSelectProps['onChange']>>((option) => {
        state.orientation.set({
            val: option?.value ?? null,
            err: undefined
        });
    }, [state.orientation]);

    const onTagsChange = React.useCallback<NonNullable<SearchableMultiSelectProps['onChange']>>((value) => {
        setTags(value);
        state.tags.err.set(undefined);
    }, [state.tags.err]);

    const onClassRangeChange = React.useCallback<NonNullable<ListRangeCmpProps['onChange']>>((type, value) => {
        setClassRange(type, value);
        state.classRange.err.set(undefined);
    }, [setClassRange, state.classRange.err]);

    const [defaultSource, setDefaultSource] = React.useState<string | undefined>(editorValue.current);

    const handleSubmit = React.useCallback<React.FormEventHandler<HTMLFormElement>>(async (e) => {
        console.log("Submit task");
        e.preventDefault();
        e.stopPropagation();
        let newGeneralError: (typeof generalError)['value'] = undefined;
        let newTaskError: (typeof taskError) = undefined;

        if (state.name.val.value === null
            || state.name.val.value.length < NAME_MIN_LEN
            || state.name.val.value.length > NAME_MAX_LEN
        ) {
            state.name.err.set(`Task name must be string between ${NAME_MIN_LEN} and ${NAME_MAX_LEN} chars long.`);
        }
        else if (state.orientation.val.value !== 'horizontal' && state.orientation.val.value !== 'vertical') {
            state.orientation.err.set(`Task orientation must be horizontal or vertical.`);
        }
        else if (tags.length < 1) {
            state.tags.err.set("Task tags cannot be empty.");
        }
        else if (state.difficulty.val.value == null) {
            state.difficulty.err.set("Task must have a difficulty.");
        }
        else if (classRange.min == null || classRange.max == null) {
            state.classRange.err.set("Task class must have minimum class and maximum class");
        }
        else if (
            (classRangeErrors.minError 
                ?? classRangeErrors.maxError 
                ?? state.classRange.err.value
                ?? state.classRange.minError.value
                ?? state.classRange.maxError.value
                ) == null
            ) {
            setTaskError(newTaskError);
            generalError.set(newGeneralError);
           const error = await action({
                name: state.name.val.value,
                display: state.orientation.val.value,
                tags: tags,
                source: editorValue.current,
                sourceChanged:sourceChanged.current,
                difficulty: Number(state.difficulty.val.value),
                classRange: {
                    min: classRange.min,
                    max: classRange.max
                },
                isPublic: state.isPublic.value
            });
            if (error) {
                if(!error.generalError){
                    const value = error.value;
                    if(value.isFormError){
                    const formError = value.error;
                        state.set(prev => {
                            prev.name.err = formError.name;
                            const classRangeError = formError.classRange;
                            prev.classRange = {
                                err:classRangeError?.error,
                                minError:classRangeError?.minError,
                                maxError:classRangeError?.maxError
                            };
                            prev.difficulty.err = formError.difficulty;
                            prev.tags.err = formError.tags;
                            prev.orientation.err = formError.display;
                            return {
                                ...prev
                            };
                        });
                    }
                    else{
                    newTaskError = {
                        error: value.error.error,
                        status: value.error.status,
                        statusText: value.error.statusText
                    };
                }
                }
                else{
                    const value = error.value;
                    newGeneralError = {
                        message:value.message,
                        description:value.description
                    };
                }
                console.log("Error: ");
                console.log(JSON.stringify(error));
            }
        }
        setTaskError(newTaskError);
        generalError.set(newGeneralError);
    },[action, classRange.max, classRange.min, classRangeErrors.maxError, classRangeErrors.minError, generalError, state, tags]);

    const onFormInvalid = React.useCallback<React.FormEventHandler<HTMLFormElement>>(async () => {
        setActiveTab('filters');
    },[]);

    const [activeTab,setActiveTab] = React.useState<string|null>('filters');
    return (
        <Stack className={styles.rootStack} align={'center'}>

            <form onSubmit={handleSubmit} className={styles.rootForm} onInvalid={onFormInvalid}>
                <Group w={'100%'} justify={'flex-end'}>
                    <Checkbox
                        checked={state.isPublic.value}
                        onChange={onIsPublicChanged}
                        label={'Je veřejná'}
                    />
                    <Button type={'submit'}
                        style={{ maxWidth: 'fit-content', minWidth: 'fit-content', minHeight: '2.5rem', alignSelf: 'flex-end', margin: '1rem' }}>
                        {actionLabel}
                    </Button>
                </Group>
                {generalError.value && <ErrorAlertCmp
                    style={{ minHeight: 'fit-content', minWidth: 'fit-content', overflow: 'visible' }}
                    withCloseButton
                    onClose={clearGeneralError}
                >
                    <Text>Zpráva: {generalError.value.message}</Text>
                    {generalError.value.description
                        && <Text>Popis: {generalError.value.description}</Text>}
                </ErrorAlertCmp>
                }
                {taskError
                    && <ApiErrorAlertCmp
                        style={{ minHeight: 'fit-content', minWidth: 'fit-content', width: '100%', overflow: 'visible' }}
                        error={taskError.error}
                        status={taskError.status}
                        statusText={taskError.statusText}
                        onClose={clearTaskError}
                    />}
                <Tabs value={activeTab} onChange={setActiveTab} className={styles.rootTabs} keepMounted>
                    <Tabs.List>
                        <Tabs.Tab value={'filters'} bg={state.keys.every(key => 
                        // @ts-expect-error ts - cannot index state even with it's keys
                            state[key].err?.value === undefined) ? undefined : 'red'}>
                            Atributy
                        </Tabs.Tab>
                        <Tabs.Tab value={'source'}>Zdroj</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value={'filters'}>
                        <Group w={'100%'}>

                            <Stack w={'100%'} justify={'center'} m={'lg'} align={'center'}>
                                <TextInput
                                    label={'Název'}
                                    name={'name'}
                                    value={state.name.val.value}
                                    onChange={onNameChanged}
                                    error={state.name.err.value}
                                    minLength={NAME_MIN_LEN}
                                    maxLength={NAME_MAX_LEN}
                                    required
                                />
                                <SearchableSelect
                                    label={'Orientace'}
                                    name={'orientation'}
                                    value={state.orientation.val.value}
                                    error={state.orientation.err.value}
                                    options={[
                                        {
                                            label: 'Na šířku',
                                            value: 'horizontal'
                                        },
                                        {
                                            label: 'Na výšku',
                                            value: 'vertical'
                                        }
                                    ]}
                                    onChange={onOrientationChanged}
                                    required
                                />
                                <SearchableMultiSelect
                                    options={createInfo?.tags ?? []}
                                    name={'tags'}
                                    value={tags}
                                    onChange={onTagsChange}
                                    error={state.tags.err.value}
                                    required
                                    label={'Štítky'}
                                />
                                <SearchableSelect
                                    options={createInfo?.difficulties ?? []}
                                    name={'difficulty'}
                                    label={'Obtížnost'}
                                    value={state.difficulty.val.value}
                                    error={state.difficulty.err.value}
                                    required
                                    onChange={onDifficultyChanged}
                                />
                                <ListRangeCmp
                                    min={classRange.min ?? undefined}
                                    max={classRange.max ?? undefined}
                                    {...classRangeErrors}
                                    options={classesForCmp ?? []}
                                    required
                                    error={state.classRange.err.value}
                                    minName={'min_class'}
                                    maxName={'max_class'}
                                    label={'Rozsah tříd'}
                                    onChange={onClassRangeChange}
                                />

                            </Stack>

                        </Group>
                    </Tabs.Panel>
                    <Tabs.Panel value={'source'} className={styles.tabsPanel} >
                        <Suspense fallback={<LoaderCmp />}>
                        <Box className={styles.sourceEditorWrapper}>
                            {XMLEditorCmp && <XMLEditorCmp
                                defaultValue={defaultSource}
                                className={styles.editor}
                                editorRef={editorRef}
                                onChange={onEditorValueChange} />
                            }
                        </Box>
                        </Suspense>
                    </Tabs.Panel>
                </Tabs>
            </form>


        </Stack>
    )
};

export { UpdateTaskPageCmp, type Props as UpdateTaskPageCmpProps };
