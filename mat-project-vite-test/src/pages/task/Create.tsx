import React, { FC, useEffect, useState } from "react"
import { SearchableMultiSelect } from "../../components/SearchableMultiSelect";
import { Editor } from "@monaco-editor/react";
import { Box, Button, Checkbox, Group, Stack, Text } from "@mantine/core";
import { createTask } from "../../api/task/create/create";
import { useHookstate } from "@hookstate/core";
import { ApplicationErrorInformation } from "../../api/dtos/errors/error_response";
import { getTaskCreateInfo } from "../../api/task/createInfo/createInfo";
import { ApiController } from "../../types/composed/apiController";
import { SearchableSelect } from "../../components/SearchableSelectCmp";
import { ListRangeCmp } from "../../components/ListRangeCmp";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { ErrorAlertCmp } from "../../components/ErrorAlertCmp";

interface Props {

}

const taskCreateInfoControl = new ApiController();
const taskCreateControl = new ApiController();


const Create: FC<Props> = () => {
    // const editor = useMonaco();
    console.log("Rerendering Create");
    const editorValue = React.useRef<string | undefined>();
    const generalError = useHookstate<{
        message: string,
        description?: string
    } | undefined>(undefined);
    const [taskError,setTaskError] = React.useState<{
        status: number,
        statusText: string,
        error?: ApplicationErrorInformation
    } | undefined>(undefined);

    const [createInfo, setCreateInfo] = useState<{
        tags: Array<{ value: string, label: string }>,
        difficulties: Array<{ value: string, label: string }>,
        sortedClasses: Array<{ orderedId: number, name: string }>
    } | undefined>(undefined);

    const classesForCmp = React.useMemo(() => {
        return createInfo?.sortedClasses.map(c => c.name)
    }, [createInfo]);


    const classesRangeApiRef = React.useRef({
        getValidData(): undefined | [min: number, max: number] { return undefined }
    });

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
    }, [createInfo]);



    const onDifficultyChanged = (_label: string, value: string) => {
        state.difficulty.val.set(value);
    };

    const onTagsChanged = (values: string[]) => {
        state.tags.val.set(values);
    };

    const onIsPublicChanged: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        state.isPublic.set(e.target.checked);
    };

    const handleSubmit:React.FormEventHandler<HTMLFormElement> = async (e)=>{
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
            const classRange = classesRangeApiRef.current.getValidData();
            if (classRange === undefined) {
                state.classRange.err.set("Task must have a class.");
            }
            else {
                const response = await createTask({
                    task: {
                        tags: [...state.tags.val.value] as [string, ...string[]],
                        source: editorValue.current,
                        difficulty: Number(state.difficulty.val.value),
                        class_range: {
                            min: classRange[0],
                            max: classRange[1]
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
        <Stack style={{ height: '100%' }} align={'center'}>
            {generalError.value && <ErrorAlertCmp style={{ minHeight: 'fit-content',minWidth:'fit-content', overflow: 'visible' }} >
                <Text>Message: {generalError.value.message}</Text>
                {generalError.value.description
                    && <Text>Description: {generalError.value.description}</Text>}
            </ErrorAlertCmp>
            }
             {taskError
                && <ApiErrorAlertCmp
                style={{ minHeight: 'fit-content',minWidth:'fit-content',width:'100%', overflow: 'visible' }}
                    error={taskError.error}
                    status={taskError.status}
                    statusText={taskError.statusText}
                />}
                <form onSubmit={handleSubmit}>
            <Group>
                
                <Stack w={'fit-content'} align={'center'} m={'lg'}>
                    <SearchableMultiSelect
                        options={createInfo?.tags ?? []}
                        onChange={onTagsChanged}
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
                        options={classesForCmp ?? []}
                        apiRef={classesRangeApiRef}
                        required
                        error={state.classRange.err.value}
                        label={'Class range'}
                    />
                    <Checkbox
                        style={{ alignSelf: 'flex-end' }}
                        checked={state.isPublic.value}
                        onChange={onIsPublicChanged}
                        label={'Is public'}
                    />
                </Stack>
                <Button type={'submit'} 
                style={{ maxWidth: 'fit-content', minWidth: 'fit-content', minHeight: '2.5rem', alignSelf: 'flex-end', margin: '1rem' }}>
                    Create
                </Button>
            </Group>
            </form>
            <Box style={{ flexGrow: 1, minWidth: '100%' }}>
                <Editor height={'100%'} width={'100%'} language={'xml'} onChange={(value) => {
                    editorValue.current = value;
                }} />
            </Box>
            
        </Stack>
    )
};

export { Create, type Props as CreateProps };
