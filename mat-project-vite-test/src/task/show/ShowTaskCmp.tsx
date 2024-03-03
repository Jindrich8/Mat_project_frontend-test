import React, { FC, useEffect } from "react"
import { TaskDisplay, toTask } from "./Task";
import { HorizontalCmp } from "./Horizontal/HorizontalCmp";
import { VerticalCmp } from "./Vertical/VerticalCmp";
import { Box, Loader, Modal, Stack } from "@mantine/core";
import { takeTask } from "../../api/task/take/get";
import { BasicStyledCmpProps } from "../../types/props/props";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { VerticalTask } from "./Vertical/VerticalTask";
import { HorizontalTask } from "./Horizontal/HorizontalTask";
import { evaluateTask } from "../../api/task/take/send";
import { EvaluateTaskRequest } from "../../api/dtos/request";
import { useNavigate } from "react-router-dom";
import { useErrorResponse } from "../../utils/hooks";
import { useDisclosure } from "@mantine/hooks";
import { dump } from "../../utils/utils";
import styles from "./ShowTaskStyle.module.css"
import { createAuthApiController } from "../../components/Auth/auth";

type Props = {taskId:string} & BasicStyledCmpProps;

const evaluateTaskControl = createAuthApiController();

const takeTaskControl = createAuthApiController();
const ShowTaskCmp:FC<Props> = ({taskId,style,...baseProps}) => {
  const [task,setTask] = React.useState(
    undefined as (HorizontalTask|VerticalTask|undefined)
     );
    const [takeError,setTakeError] = useErrorResponse<typeof takeTask>();

    const clearTakeError = React.useCallback(() => {
      setTakeError(undefined);
  },[setTakeError]);

    const [evaluateError,setEvaluateError] = useErrorResponse<typeof evaluateTask>();

    const clearEvaluateError = React.useCallback(() => {
      setEvaluateError(undefined);
  },[setEvaluateError]);
    const [opened, { open, close }] = useDisclosure(evaluateError !== undefined,{
      onClose:() => setEvaluateError(undefined)
    });

    const navigateTo = useNavigate();

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
        console.log(dump(response,2));
        navigateTo(`/task/${response.body.data.task.id ?? taskId}/review`,{
          state:{
            reviewDto:response.body.data
          }
        });
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
        open();
        
      }
    }
    },[navigateTo, open, setEvaluateError, task, taskId]);

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
        !task ? <Loader />
        : (task.display === TaskDisplay.Horizontal ? 
          <HorizontalCmp task={task} order={2} onSubmit={onSubmit} /> : 
          <VerticalCmp task={task} order={2} onSubmit={onSubmit} />)
      )}
      </Box>
      <Modal opened={opened} onClose={close}>
        {evaluateError && 
        <ApiErrorAlertCmp 
        status={evaluateError.status} 
        statusText={evaluateError.statusText}
        error={evaluateError.error}
        onClose={clearEvaluateError}
         />
        }
      </Modal>
    </Stack>
  )
};

export { ShowTaskCmp, type Props as ShowTaskCmpProps };
