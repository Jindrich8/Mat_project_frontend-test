import React, { FC, useEffect } from "react"
import { toTask } from "./Task";
import { HorizontalCmp } from "./Horizontal/HorizontalCmp";
import { VerticalCmp } from "./Vertical/VerticalCmp";
import { Box, Modal, Stack } from "@mantine/core";
import { takeTask } from "../../api/task/take/get";
import { BasicStyledCmpProps } from "../../types/props/props";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { VerticalTask } from "./Vertical/VerticalTask";
import { HorizontalTask } from "./Horizontal/HorizontalTask";
import { evaluateTask } from "../../api/task/take/send";
import { EvaluateTaskRequest } from "../../api/dtos/request";
import { useDisclosure } from "@mantine/hooks";
import { dump } from "../../utils/utils";
import styles from "./ShowTaskStyle.module.css"
import { createAuthApiController } from "../../components/Auth/auth";
import { Review, toReview } from "../review/Review";
import { ReviewCmp } from "../review/ReviewCmp";
import { LoaderCmp } from "../../components/LoaderCmp";
import { ErrorResponseState } from "../../types/types";
import { ModalCmp } from "../../components/Modal/ModalCmp";
import { useNavigate } from "react-router-dom";

type Props = {taskId:string} & BasicStyledCmpProps;

const evaluateTaskControl = createAuthApiController();

const takeTaskControl = createAuthApiController();
const ShowTaskCmp:FC<Props> = ({taskId,style,...baseProps}) => {
  const [task,setTask] = React.useState(
    undefined as (HorizontalTask|VerticalTask|undefined)
     );

    const [review,setReview] = React.useState(undefined as (Review|undefined));
    const [takeError,setTakeError] = React.useState<ErrorResponseState<typeof takeTask>>();
    const navigate = useNavigate();

    const clearTakeError = React.useCallback(() => {
      setTakeError(undefined);
  },[setTakeError]);

    const [evaluateError,setEvaluateError] = React.useState<ErrorResponseState<typeof evaluateTask>>();

    const clearEvaluateError = React.useCallback(() => {
      setEvaluateError(undefined);
  },[setEvaluateError]);
    const [evaluateErrModalOpened, evaluateErrModalMethods] = useDisclosure(evaluateError !== undefined,{
      onClose:() => setEvaluateError(undefined)
    });

    

    const reviewModalClose = React.useCallback(() =>{
      console.log('review modal closed');
      setReview(undefined);
      navigate(-1);
    },[navigate]);


    useEffect(() => {
      const fetchTask = async (taskId:string) => {
        const response = await takeTask({
        },taskId,takeTaskControl);
        if(response.success){
        setTask(toTask(response.body.data,taskId));
        }
        else if(response.isServerError){
          setTakeError({
            status: response.status,
            statusText: response.statusText,
            error: response.error?.error
          });
        }
      };
      if(taskId !== undefined){
        if(task === undefined || task?.id !== taskId){
          fetchTask(taskId);
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[task,taskId]);

    

    const onSubmit = React.useCallback(async(values:EvaluateTaskRequest['exercises']) => {
      console.log("submit");
      if(task){
      const response = await evaluateTask(taskId,{
        version:task.version+'',
        exercises:values
      },evaluateTaskControl);
      if(response.success){
        setReview(toReview(response.body.data));
      }
      else if(response.isServerError){
        setEvaluateError(
          {
            status: response.status,
            statusText: response.statusText,
            error: response.error?.error
          }
        );
        console.log(dump(response,2));
        evaluateErrModalMethods.open();
      }
    }
    },[evaluateErrModalMethods, setEvaluateError, task, taskId]);

  return (
    <Stack className={styles.container} style={style} {...baseProps}>
    <Box className={styles.childContainer}>
      {takeError ? (
      <ApiErrorAlertCmp 
      status={takeError.status}
      statusText={takeError.statusText}
      error={takeError.error}
      onClose={clearTakeError}
      />
      ) : (
        !task ? <LoaderCmp />
        : (task.display === 'horizontal' ? 
          <HorizontalCmp task={task} order={2} onSubmit={onSubmit} /> : 
          <VerticalCmp task={task} order={2} onSubmit={onSubmit} />)
      )}
      </Box>
      <ModalCmp opened={evaluateErrModalOpened} onClose={evaluateErrModalMethods.close}>
        {evaluateError && 
        <ApiErrorAlertCmp 
        withoutCloseButton
        status={evaluateError.status} 
        statusText={evaluateError.statusText}
        error={evaluateError.error}
        onClose={clearEvaluateError}
         />
        }
      </ModalCmp>
      <Modal.Root 
      trapFocus
      returnFocus
      closeOnClickOutside={false}
      opened={!!review} 
      onClose={reviewModalClose} 
      className={styles.reviewModalRoot}
      fullScreen
      radius={0}
      >
        <Modal.Overlay>
        <Modal.Content className={styles.reviewModalContent}>
          <Modal.Header className={styles.reviewModalHeader}>
            <div></div>
          <Modal.Title>Review</Modal.Title>
            <Modal.CloseButton className={styles.reviewModalCloseBtn} />
          </Modal.Header>
          <Modal.Body display={'flex'} className={styles.reviewModalBody}>
        {review && <ReviewCmp review={review} order={2} />}
        </Modal.Body>
        </Modal.Content>
        </Modal.Overlay>
      </Modal.Root>
    </Stack>
  )
};

export { ShowTaskCmp, type Props as ShowTaskCmpProps };
