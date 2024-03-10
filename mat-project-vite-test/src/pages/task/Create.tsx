import React, { FC, useEffect, useState } from "react"
import { SearchableMultiSelect } from "../../components/SearchableMultiSelect/SearchableMultiSelect";
import { Editor, EditorProps } from "@monaco-editor/react";
import { Box, Button, Checkbox, Group, Stack, Text } from "@mantine/core";
import { createTask } from "../../api/task/create/create";
import { useHookstate } from "@hookstate/core";
import { ApplicationErrorInformation } from "../../api/dtos/errors/error_response";
import { getTaskCreateInfo } from "../../api/task/createInfo/createInfo";
import { SearchableSelect, SearchableSelectProps } from "../../components/SearchableSelectCmp";
import { ListRangeCmp} from "../../components/ListRange/ListRangeCmp";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { ErrorAlertCmp } from "../../components/ErrorAlertCmp";
import { createAuthApiController } from "../../components/Auth/auth";
import { Any } from "../../types/types";
import styles from "./CreateStyle.module.css";
import { useListRange } from "../../components/ListRange/ListRangeType";

interface Props {

}

const taskCreateInfoControl = createAuthApiController();
const taskCreateControl = createAuthApiController();


const Create: FC<Props> = () => {
    // const editor = useMonaco();
    const editorRef = React.useRef<Any>(null);
    console.log("Rerendering Create");
    const editorValue = React.useRef<string | undefined>();
    const generalError = useHookstate<{
        message: string,
        description?: string
    } | undefined>(undefined);
    const [taskError, setTaskError] = React.useState<{
        status: number,
        statusText: string,
        error?: ApplicationErrorInformation
    } | undefined>(undefined);

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

    const onMount: EditorProps['onMount'] = React.useCallback((editor:Any) => {
        editorRef.current = editor;
    }, []);


    const state = useHookstate({
        difficulty: {
            val: undefined as (string | undefined),
            err: undefined as (string | undefined)
        },
        tags: {
            val: [] as string[],
            err: undefined as (string | undefined)
        },
        classRange: {
            err: undefined as (string | undefined)
        },
        isPublic: false as boolean
    });


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

    const [classRange,setClassRange]= useListRange(classesForCmp ?? []);

    const onDifficultyChanged = React.useCallback<NonNullable<SearchableSelectProps['onChange']>>((option) => {
        state.difficulty.val.set(option?.value);
    },[state.difficulty.val]);

    const onIsPublicChanged: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        state.isPublic.set(e.target.checked);
    };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!editorValue.current) {
            generalError.set({
                message: "Task source cannot be empty.",
                description: "To be able to create task, you need to write it's source first!"
            });
        }
        else if (state.tags.val.length < 1) {
            state.tags.err.set("Task tags cannot be empty.");
        }
        else if (state.difficulty.val.value === undefined) {
            state.difficulty.err.set("Task must have a difficulty.");
        }
        else {
            
            if (classRange.min == null || classRange.max == null) {
                state.classRange.err.set("Task must have a class.");
            }
            else if(classRange.minError === classRange.maxError === undefined) {
                const response = await createTask({
                    task: {
                        tags: [...state.tags.val.value] as [string, ...string[]],
                        source: editorValue.current,
                        difficulty: Number(state.difficulty.val.value),
                        class_range: {
                            min: classRange.min,
                            max: classRange.max
                        },
                        is_public: state.isPublic.value
                    }
                },
                    taskCreateControl
                );
                if (response.success) {
                    alert(`Task successfully created - id: ${response.body.data.taskId}`);
                }
                else if (response.isServerError) {
                    setTaskError(
                        {
                            error: response.error?.error,
                            status: response.status,
                            statusText: response.statusText
                        }
                    );
                    console.log("Error: ");
                    console.log(JSON.stringify(taskError));
                }
            }
        }
    };



    return (
        <Stack style={{ height: '100%', width: '100%' }} align={'center'}>
            {generalError.value && <ErrorAlertCmp style={{ minHeight: 'fit-content', minWidth: 'fit-content', overflow: 'visible' }} >
                <Text>Message: {generalError.value.message}</Text>
                {generalError.value.description
                    && <Text>Description: {generalError.value.description}</Text>}
            </ErrorAlertCmp>
            }

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Group w={'100%'}>

                    <Stack w={'100%'} justify={'center'} m={'lg'} align={'center'}>
                        <SearchableMultiSelect
                            options={createInfo?.tags ?? []}
                            onChange={state.tags.val.set}
                            error={state.tags.err.value}
                            required
                            label={'Tags'}
                        />
                        <SearchableSelect
                            options={createInfo?.difficulties ?? []}
                            label={'Difficulty'}
                            error={state.difficulty.err.value}
                            required
                            onChange={onDifficultyChanged}
                        />
                        <ListRangeCmp
                        min={classRange.min ?? undefined}
                        max={classRange.max ?? undefined}
                        minError={classRange.minError}
                        maxError={classRange.maxError}
                            options={classesForCmp ?? []}
                            required
                            error={state.classRange.err.value}
                            label={'Class range'}
                            onChange={setClassRange}
                        />
                        <Group>
                            <Checkbox
                                checked={state.isPublic.value}
                                onChange={onIsPublicChanged}
                                label={'Is public'}
                            />
                            <Button type={'submit'}
                                style={{ maxWidth: 'fit-content', minWidth: 'fit-content', minHeight: '2.5rem', alignSelf: 'flex-end', margin: '1rem' }}>
                                Create
                            </Button>
                        </Group>
                    </Stack>

                </Group>
            </form>
            {taskError
                && <ApiErrorAlertCmp
                    style={{ minHeight: 'fit-content', minWidth: 'fit-content', width: '100%', overflow: 'visible' }}
                    error={taskError.error}
                    status={taskError.status}
                    statusText={taskError.statusText}
                    onClose={clearTaskError}
                />}
            <Box style={{ minWidth: '100%', flexGrow: 1, height: '100%', minHeight: '25rem' }}>
                <Editor wrapperProps={{ minHeight: '25rem' }}  className={styles.editor}  height={'100%'} width={'100%'} language={'xml'} onMount={onMount} onChange={(value) => {
                    editorValue.current = value;
                }} />
            </Box>

        </Stack>
    )
};

export { Create, type Props as CreateProps };
