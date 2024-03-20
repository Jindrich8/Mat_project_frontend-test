import React, { FC, useEffect } from "react"
import { createAuthApiController } from "../../components/Auth/auth";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { TagsCmp } from "../../components/Tags/TagsCmp";
import { LoaderCmp } from "../../components/LoaderCmp";
import { ErrorResponseState } from "../../types/types";
import { getMyTaskDetail } from "../../api/task/myDetail/get";
import { deleteTask as apiDeleteTask } from "../../api/task/delete/delete";
import { utcStrTimestampToLocalStr } from "../../utils/utils";

interface Props {

}

const taskDetailControl = createAuthApiController();
const deleteTaskControl = createAuthApiController();

const MyTaskDetail: FC<Props> = () => {
    const { taskId } = useParams();
    const [taskDetail, setMyTaskDetail] = React.useState(undefined as ({
        name: string,
        description: string,
        difficulty: string,
        minClass: string,
        maxClass: string,
        orientation:'horizontal'|'vertical',
        creationTimestamp:string,
        modificationTimestamp?:string,
        isPublic:boolean,
        version:string,
        tags: string[]
    } | undefined));
    const [error,setError] = React.useState<ErrorResponseState<typeof getMyTaskDetail>>();
    const clearError = React.useCallback(() => setError(undefined),[setError]);

    useEffect(() => {
        const fetchMyTaskDetail = async (id: string) => {
            const response = await getMyTaskDetail(id, taskDetailControl);
            if (response.success) {
                const task = response.body.data.task;
                let modificationTimestamp = task.modification_timestamp;
                if(modificationTimestamp != null){
                    modificationTimestamp = utcStrTimestampToLocalStr(modificationTimestamp);
                }
                setMyTaskDetail({
                    name: task.name,
                    description: task.description ?? '',
                    minClass: task.class_range.min.name,
                    maxClass: task.class_range.max.name,
                    tags: task.tags.map(tag => tag.name),
                    creationTimestamp: utcStrTimestampToLocalStr(task.creation_timestamp),
                    modificationTimestamp: modificationTimestamp  ?? undefined,
                    orientation:task.orientation,
                    isPublic:task.is_public,
                    version:task.version,
                    difficulty: task.difficulty.name,
                });
            }
            else if(response.isServerError){
                setError({
                    status: response.status,
                    statusText: response.statusText,
                    error: response.error?.error
                });
            }
        };

        if(taskId){
        fetchMyTaskDetail(taskId);
        }
    }, [setError, taskId]);
    const navigate = useNavigate();
    const updateTask = React.useCallback(()=>navigate(`/task/${taskId}/update`),[navigate, taskId]);

    const deleteTask = React.useCallback(async()=>{
      if(taskId){
     const response = await apiDeleteTask(taskId,deleteTaskControl);
     if(response.success){
      navigate(`/task/myList`);
     }
     else if(response.isServerError){
        setError({
          status:response.status,
          statusText:response.statusText,
          error:response.error?.error
        });
     }
      }
    },[navigate, taskId]);

    return (
        <Stack>
            {error && <ApiErrorAlertCmp 
            status={error.status} 
            statusText={error.statusText} 
            error={error.error}
            onClose={clearError}
             />}
        {!taskDetail ? <LoaderCmp /> : (
            <Stack align={'center'}>
                <Title order={1}>{taskDetail.name}</Title>
                <Text>{taskDetail.description}</Text>
                <Text >Difficulty: {taskDetail?.difficulty}</Text>
                <Group><Text>Class range: </Text><Text>{taskDetail?.minClass} - </Text> <Text>{taskDetail?.maxClass}</Text></Group>
                <Text>Orientation: {taskDetail.orientation}</Text>
                <Group><Text>Tags: </Text><TagsCmp tags={taskDetail.tags} /></Group>
                <Group><Text>Is public: </Text><Text>{taskDetail.isPublic ? "True" : "False"}</Text></Group>
                <Group><Text>Version: </Text><Text>{taskDetail.version}</Text></Group>
                <Group><Text>Created at: </Text><Text>{taskDetail.creationTimestamp}</Text></Group>
                {taskDetail.modificationTimestamp && 
                <Group><Text>Updated at: </Text><Text>{taskDetail.modificationTimestamp}</Text></Group>
                }
                <Group>
                <Button onClick={updateTask}>Update</Button>
                <Button onClick={deleteTask}>Delete</Button>
                </Group>
            </Stack>)
        }
        </Stack>
    )
};

export { MyTaskDetail, type Props as MyTaskDetailProps };
