import React, { FC, useEffect } from "react"
import { toTask } from "./Task";
import { HorizontalCmp } from "./Horizontal/HorizontalCmp";
import { VerticalCmp } from "./Vertical/VerticalCmp";
import { Box, Button, Group, Modal, Stack, Text } from "@mantine/core";
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
import { toReview } from "../review/Review";
import { ReviewCmp } from "../review/ReviewCmp";
import { LoaderCmp } from "../../components/LoaderCmp";
import { ErrorResponseState } from "../../types/types";
import { ModalCmp } from "../../components/Modal/ModalCmp";
import { useNavigate } from "react-router-dom";
import { ReviewTaskResponse } from "../../api/dtos/success_response";

type Props = {taskId:string} & BasicStyledCmpProps;

const evaluateTaskControl = createAuthApiController();

const reviewKeyPrefix = "task-review-data";

const takeTaskControl = createAuthApiController();
const ShowTaskCmp:FC<Props> = ({taskId,style,...baseProps}) => {
  const reviewKey = reviewKeyPrefix+taskId;
  const [task,setTask] = React.useState(
    undefined as (HorizontalTask|VerticalTask|undefined)
     );

  const [review, setReview] = React.useState(() => {
    const storedReview = sessionStorage.getItem(reviewKey);
    try {
      if (storedReview) {
        const parsedReview = JSON.parse(storedReview);
        if (parsedReview) {
          return toReview(parsedReview);
        }
      }
    }
    catch { /* empty */ }
    return undefined;
  });

  const currentHref = React.useRef<string|undefined>(undefined);

  useEffect(() => {
    currentHref.current = window.location.href;
    return () => {
      if(window.location.href !== currentHref.current) {
      sessionStorage.removeItem(reviewKey);
      }
    };
  });
    const [submittedData,setSubmittedData] = React.useState<EvaluateTaskRequest['exercises']|undefined>(undefined);
    const [takeError,setTakeError] = React.useState<ErrorResponseState<typeof takeTask>>();
    const onConfirmModalClose = React.useCallback(() => {
      setSubmittedData(undefined);
    },[]);

    const setReviewToStorage = React.useCallback((data:ReviewTaskResponse)=>{
      setReview(toReview(data));
      sessionStorage.setItem(reviewKey,JSON.stringify(data));
    },[reviewKey]);
    
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
      sessionStorage.removeItem(reviewKey);
      navigate(-1);
    },[navigate, reviewKey]);


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
      if(taskId !== undefined && !review){
        if(task === undefined || task?.id !== taskId){
          fetchTask(taskId);
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[task,taskId]);

    const evaluateTaskCallback = React.useCallback(async()=>{
      if(task && submittedData){
        const response = await evaluateTask(taskId,{
          version:task.version+'',
          exercises:submittedData
        },evaluateTaskControl);
        if(response.success){
          setReviewToStorage(response.body.data);
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
      setSubmittedData(undefined);
    },[evaluateErrModalMethods, setReviewToStorage, submittedData, task, taskId]);

    const onSubmit = React.useCallback(async(values:EvaluateTaskRequest['exercises']) => {
      console.log("submit");
      setSubmittedData(values);
    },[]);

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
          <Modal.Title>Vyhodnocení úlohy</Modal.Title>
            <Modal.CloseButton className={styles.reviewModalCloseBtn} />
          </Modal.Header>
          <Modal.Body display={'flex'} className={styles.reviewModalBody}>
        {review && <ReviewCmp review={review} order={2} />}
        </Modal.Body>
        </Modal.Content>
        </Modal.Overlay>
      </Modal.Root>
      <ModalCmp opened={submittedData !== undefined} onClose={onConfirmModalClose} title={'Odeslat úlohu?'}>
          <Stack>
            <Text fw={'bold'}>Opravdu chceš odeslat uto úlohu?</Text>
            <Text size={'xs'}>Tato akce je nevratná.</Text>
            <Group>
              <Button onClick={onConfirmModalClose}>Zrušit</Button>
              <Button onClick={evaluateTaskCallback}>Odeslat</Button>
            </Group>
          </Stack>
      </ModalCmp>
    </Stack>
  )
};

export { ShowTaskCmp, type Props as ShowTaskCmpProps };
