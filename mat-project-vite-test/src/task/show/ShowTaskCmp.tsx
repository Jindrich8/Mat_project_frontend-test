import React, { FC, useEffect } from "react"
import { TaskDisplay, toTask } from "./Task";
import { HorizontalCmp } from "./Horizontal/HorizontalCmp";
import { VerticalCmp } from "./Vertical/VerticalCmp";
import { Box, Loader, Stack } from "@mantine/core";
import { takeTask } from "../../api/task/take/get";
import { BasicStyledCmpProps } from "../../types/props/props";
import { GeneralErrorDetails, TaskTakeErrorResponseDetails } from "../../api/dtos/errors/error_response";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { VerticalTask } from "./Vertical/VerticalTask";
import { HorizontalTask } from "./Horizontal/HorizontalTask";
import { ErrorResponseType } from "../../types/composed/errorResponseType";
import { ApiController } from "../../types/composed/apiController";

type Props = {taskId:string} & BasicStyledCmpProps;

const takeTaskControl = new ApiController();
const ShowTaskCmp:FC<Props> = ({taskId,style,...baseProps}) => {
  const [task,setTask] = React.useState(
    undefined as (HorizontalTask|VerticalTask|undefined)
     );
    const [takeError,setTakeError] = React.useState<({
      status:number,
      statusText:string,
      errorResp:ErrorResponseType<TaskTakeErrorResponseDetails|GeneralErrorDetails>|undefined
    }|undefined)>(undefined);

    useEffect(() => {
      const fetchTask = async (taskId:string) => {
        const response = await takeTask({
        },taskId,takeTaskControl);
        if(response.success){
        setTask(toTask(response.body.data,taskId));
        }
        else if(response.isServerError){
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const {success:_,error:errorResp,...error} = response;
          setTakeError({...error,errorResp:errorResp});
        }
      };
      if(taskId !== undefined){
        if(task === undefined || task?.id !== taskId){
          fetchTask(taskId);
        }
      }
    },[task,taskId]);
  return (
    <Stack style={{boxSizing:'border-box',maxHeight:'100vh',...style}} {...baseProps}>
    <Box style={{flexGrow:1,paddingBottom:'1rem'}}>
      {takeError ? (
      <ApiErrorAlertCmp 
      status={takeError.status}
      statusText={takeError.statusText}
      error={takeError.errorResp}/>
      ) : (
        !task ? <Loader />
        : (task.display === TaskDisplay.Horizontal ? 
          <HorizontalCmp task={task} order={2} /> : 
          <VerticalCmp task={task} order={2} />)
      )}
      </Box>
    </Stack>
  )
};

export { ShowTaskCmp, type Props as ShowTaskCmpProps };
