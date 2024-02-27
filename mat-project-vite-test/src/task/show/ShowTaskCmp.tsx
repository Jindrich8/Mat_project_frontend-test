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
import { ApiController } from "../../types/composed/apiController";
import { evaluateTask } from "../../api/task/take/send";
import { EvaluateTaskRequest } from "../../api/dtos/request";
import { useNavigate } from "react-router-dom";
import { useErrorResponse } from "../../utils/hooks";
import { useDisclosure } from "@mantine/hooks";
import { dump } from "../../utils/utils";

type Props = {taskId:string} & BasicStyledCmpProps;

const evaluateTaskControl = new ApiController();

const takeTaskControl = new ApiController();
const ShowTaskCmp:FC<Props> = ({taskId,style,...baseProps}) => {
  const [task,setTask] = React.useState(
    undefined as (HorizontalTask|VerticalTask|undefined)
     );
    const [takeError,setTakeError] = useErrorResponse<typeof takeTask>();

    const [evaluateError,setEvaluteError] = useErrorResponse<typeof evaluateTask>();
    const [opened, { open, close }] = useDisclosure(evaluateError !== undefined,{
      onClose:() => setEvaluteError(undefined)
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

    

    const onSubmit = async(values:EvaluateTaskRequest['exercises']) => {
      console.log("submit");
      if(task){
      const response = await evaluateTask(taskId,{
        version:task.version,
        exercises:values
      },evaluateTaskControl);
      if(response.success){
        console.log(dump(response,2));
        navigateTo(`/task/${taskId}/review`,{
          relative:'path',
          state:{
            key:"key",
            //reviewDto:response.body.data
          }
        });
      }
      else if(response.isServerError){
        setEvaluteError(
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
    };
  return (
    <Stack style={{boxSizing:'border-box',maxHeight:'100vh',...style}} {...baseProps}>
    <Box style={{flexGrow:1,paddingBottom:'1rem'}}>
      {takeError ? (
      <ApiErrorAlertCmp 
      status={takeError.status}
      statusText={takeError.statusText}
      error={takeError.error}/>
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
         />
        }
      </Modal>
    </Stack>
  )
};

export { ShowTaskCmp, type Props as ShowTaskCmpProps };
