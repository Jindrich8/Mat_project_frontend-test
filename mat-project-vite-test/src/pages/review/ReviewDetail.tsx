import React, { FC, useEffect } from "react"
import { createAuthApiController } from "../../components/Auth/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { TagsCmp } from "../../components/Tags/TagsCmp";
import { LoaderCmp } from "../../components/LoaderCmp";
import { ErrorResponseState } from "../../types/types";
import {  } from "../../api/task/myDetail/get";
import { getTaskReviewDetail } from "../../api/task/review/get";
import { ExercisePointsCmp } from "../../components/ExercisePointsCmp";
import { deleteReview as apiDeleteReview } from "../../api/task/review/delete";

interface Props {

}

const taskDetailControl = createAuthApiController();
const deleteTaskReviewControl = createAuthApiController();
const ReviewDetail: FC<Props> = () => {
    const { reviewId } = useParams();
    const [taskDetail, setReviewDetail] = React.useState(undefined as ({
        name: string,
        description: string,
        difficulty: string,
        minClass: string,
        maxClass: string,
        evaluationTimestamp:string,
        tags: string[],
        author:string,
        taskId?:string,
        points:{
            has:number,
            max:number
        }
    } | undefined));
    const navigate = useNavigate();
    const [error,setError] = React.useState<ErrorResponseState<typeof getTaskReviewDetail>>();
    const clearError = React.useCallback(() => setError(undefined),[setError]);
    console.log("Rendering task review detail");
    useEffect(() => {
        const fetchReviewDetail = async (id: string) => {
            console.log("Fetching review detail with id: "+id);
            const response = await getTaskReviewDetail(id, taskDetailControl);
            if (response.success) {
                const review = response.body.data;
                const task = review.task_detail;
                setReviewDetail({
                    name: task.name,
                    description: task.description ?? '',
                    minClass: task.class_range.min.name,
                    maxClass: task.class_range.max.name,
                    tags: task.tags.map(tag => tag.name),
                    author:task.author.name,
                    evaluationTimestamp:review.evaluation_timestamp,
                    points:{
                        ...review.points
                    },
                    difficulty: task.difficulty.name,
                    taskId: review.task_has_changed ? undefined : task.id,
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

        if(reviewId){
        fetchReviewDetail(reviewId);
        }
    },[reviewId]);

    const deleteReview = React.useCallback(async() =>{
    if(reviewId !== undefined){
    const response = await apiDeleteReview(reviewId,deleteTaskReviewControl);
    if(response.success){
        navigate('/task/review/list');
    }
    else if(response.isServerError){
      setError({
        status:response.status,
        statusText:response.statusText,
        error:response.error?.error
      });
    }
  }
    },[navigate, reviewId]);

    const navigateShowReview = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
        e.stopPropagation(); // prevent
        navigate(`/task/review/${reviewId}/show`);
      }, [navigate, reviewId]);

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
                <Text >Obtížnost: {taskDetail?.difficulty}</Text>
                <Group><Text>Rozsah tříd: </Text><Text>{taskDetail?.minClass} - </Text> <Text>{taskDetail?.maxClass}</Text></Group>
                <Group><Text>Body: </Text><ExercisePointsCmp {...taskDetail.points} /></Group>
                <Group><Text>Štítky: </Text><TagsCmp tags={taskDetail.tags} /></Group>
                <Group><Text>Datum a čas vyhodnocení: </Text><Text>{taskDetail.evaluationTimestamp}</Text></Group>
                {taskDetail.taskId != null && 
                <Group><Link to={`/task/${taskDetail.taskId}/detail`}>Úloha</Link></Group>
                }
                <Group>
                    <Button onClick={deleteReview}>Smazat</Button>
                    <Button onClick={navigateShowReview}>Zobrazit</Button>
                </Group>
            </Stack>)
        }
        </Stack>
    )
};

export { ReviewDetail, type Props as ReviewDetailProps };
