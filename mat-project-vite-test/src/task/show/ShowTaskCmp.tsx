import React, { FC, useEffect } from "react"
import { Task, TaskDisplay, toTask } from "./Task";
import { HorizontalCmp } from "./Horizontal/HorizontalCmp";
import { VerticalCmp } from "./Vertical/VerticalCmp";
import { Switch, Box, Loader, Title, Stack } from "@mantine/core";
import { getShowTask } from "../../api/task/show/get";
import { Either } from "../../types/base";
import { BasicStyledCmpProps } from "../../types/props/props";

type Props = Either<{task:Task},{taskId:string}> & BasicStyledCmpProps;

const ShowTaskCmp:FC<Props> = ({task:taskArg,taskId,style,...baseProps}) => {
    const [task,setTask] = React.useState(taskArg);
    const [show,setShow] = React.useState(true);

    useEffect(() => {
        if(task === undefined && taskId !== undefined){
        setTask(toTask(getShowTask({id:taskId})))
        }
    },[taskId,task]);
  return (
    <Stack style={{boxSizing:'border-box',maxHeight:'100vh',...style}} {...baseProps}>
    <Switch checked={show} onChange={(e) =>setShow(e.currentTarget.checked)}/>
    {show ? 
    (<Box style={{flexGrow:1}}>{!task ? (<Loader />):
        (task.display === TaskDisplay.Horizontal ? 
        <HorizontalCmp task={task} order={2} /> : 
        <VerticalCmp task={task} order={2} />)
}</Box>)
:<Title>Hidden</Title>}
    </Stack>
  )
};

export { ShowTaskCmp, type Props as ShowTaskCmpProps };
