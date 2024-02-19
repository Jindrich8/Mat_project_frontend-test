import React, { FC, useEffect } from "react"
import { Task, TaskDisplay, toTask } from "./Task";
import { HorizontalCmp } from "./Horizontal/HorizontalCmp";
import { VerticalCmp } from "./Vertical/VerticalCmp";
import { Switch, Box, Loader, Title, Stack } from "@mantine/core";
import { getShowTask } from "../../api/task/take/get";
import { Either } from "../../types/base";
import { BasicStyledCmpProps } from "../../types/props/props";
import { useHookstate } from "@hookstate/core";
import { ApplicationErrorResponse } from "../../api/dtos/errors/error_response";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { tryGetLastArrayValue } from "../../utils/utils";

type Props = Either<{task:Task},{taskId:string}> & BasicStyledCmpProps;

const ShowTaskCmp:FC<Props> = ({task:taskArg,taskId,style,...baseProps}) => {
    const [task,setTask] = React.useState(taskArg);
    const [show,setShow] = React.useState(true);
    const takeError = useHookstate<({
      status:number,
      statusText:string,
      errorResp:ApplicationErrorResponse
    }|undefined)>(undefined);

    useEffect(() => {
      const fetchTask = async (taskId:string) => {
        const response = await getShowTask({},taskId);
        if(response.success){
        setTask(toTask(response.body,taskId));
        }
        else{
          
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const {success:_,error:errorResp,...error} = response;
          takeError.set({...error,errorResp:errorResp});
        }
      };
        if(task === undefined && taskId !== undefined){
          fetchTask(taskId);
        }
    },[taskId,task]);
    const takeErrorValue = takeError.get();
    const lastTakeError = takeErrorValue?.errorResp.errors && tryGetLastArrayValue(takeErrorValue.errorResp.errors);
    const apiErrror =  lastTakeError  ? {
      status:takeErrorValue.status,
      code:lastTakeError.details?.code,
      statusText:takeErrorValue.statusText,
    message:lastTakeError.message,
  description:lastTakeError.description
    } : undefined;
  return (
    <Stack style={{boxSizing:'border-box',maxHeight:'100vh',...style}} {...baseProps}>
    <Switch checked={show} onChange={(e) =>setShow(e.currentTarget.checked)}/>
    {show ? 
    (<Box style={{flexGrow:1,paddingBottom:'1rem'}}>{!task  ? (apiErrror ? (<ApiErrorAlertCmp error={apiErrror}/>) : (<Loader />)):
        (task.display === TaskDisplay.Horizontal ? 
        <HorizontalCmp task={task} order={2} /> : 
        <VerticalCmp task={task} order={2} />)
}</Box>)
:<Title>Hidden</Title>}
    </Stack>
  )
};

export { ShowTaskCmp, type Props as ShowTaskCmpProps };
