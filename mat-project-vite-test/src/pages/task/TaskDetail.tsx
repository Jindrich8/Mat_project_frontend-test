import React, { FC, useEffect } from "react"
import { getTaskDetail } from "../../api/task/detail/get";
import { createAuthApiController } from "../../components/Auth/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { TagsCmp } from "../../components/Tags/TagsCmp";
import { LoaderCmp } from "../../components/LoaderCmp";
import { ErrorResponseState } from "../../types/types";

interface Props {

}

const taskDetailControl = createAuthApiController();
const TaskDetail: FC<Props> = () => {
    const { taskId } = useParams();
    const [taskDetail, setTaskDetail] = React.useState(undefined as ({
        name: string,
        description: string,
        difficulty: string,
        minClass: string,
        maxClass: string,
        tags: string[],
        author: string,
        taskReview?: {
            id: string,
            score: number
        }
    } | undefined));
    const [error,setError] = React.useState<ErrorResponseState<typeof getTaskDetail>>();
    const clearError = React.useCallback(() => setError(undefined),[setError]);

    useEffect(() => {
        const fetchTaskDetail = async (id: string) => {
            const response = await getTaskDetail(id, taskDetailControl);
            if (response.success) {
                const task = response.body.data.task;
                setTaskDetail({
                    name: task.name,
                    description: task.description ?? '',
                    minClass: task.class_range.min.name,
                    maxClass: task.class_range.max.name,
                    tags: task.tags.map(tag => tag.name),
                    author: task.author.name,
                    difficulty: task.difficulty.name,
                    taskReview: task.task_review && {
                        id: task.task_review.id,
                        score: task.task_review.score
                    }
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
        fetchTaskDetail(taskId);
        }
    }, [setError, taskId]);
    const navigate = useNavigate();
    const takeTask = React.useCallback(()=>navigate(`/task/${taskId}/take`),[navigate, taskId]);

    return (
        <Stack>
            {error && <ApiErrorAlertCmp 
            status={error.status} 
            statusText={error.statusText} 
            onClose={clearError}
             />}
        {!taskDetail ? <LoaderCmp /> : (
            <Stack align={'center'}>
                <Title order={1}>{taskDetail.name}</Title>
                <Text>{taskDetail.description}</Text>
                <Text >Difficulty: {taskDetail?.difficulty}</Text>
                <Group><Text>Class range: </Text><Text>{taskDetail?.minClass} - </Text> <Text>{taskDetail?.maxClass}</Text></Group>
                <Text>Author: {taskDetail.author}</Text>
                <Group><Text>Tags: </Text><TagsCmp tags={taskDetail.tags} /></Group>
                {taskDetail.taskReview && (
                    <Group>
                        <Text>Review: </Text>
                        <Link to={`/task/review/${taskDetail.taskReview.id}/detail`}>
                            {'~'+(taskDetail.taskReview.score*100).toFixed(2)+'%'}
                            </Link>
                    </Group>)
                }
                <Button onClick={takeTask}>Take</Button>
            </Stack>)
        }
        </Stack>
    )
};

export { TaskDetail, type Props as TaskDetailProps };
