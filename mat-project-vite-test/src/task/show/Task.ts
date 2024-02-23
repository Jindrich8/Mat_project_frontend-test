import { FC } from "react";
import { BasicProps } from "../../types/props/props";
import { HorizontalTask, toHorizontalTask } from "./Horizontal/HorizontalTask";
import { VerticalTask, toVerticalTask } from "./Vertical/VerticalTask";
import { TakeTaskResponseDto } from "./types";


enum TaskEntryType {
    Group='group',
    Exercise='exercise'
}
enum TaskDisplay {
    Horizontal = 'horizontal',
    Vertical = 'vertical',
}

type Task = VerticalTask | HorizontalTask;

interface BaseTask{
    id:string;
    name:string;
    description:string;
    getFilledDataForServer():(unknown|undefined)[];
}

type RenderCmp<Props extends BasicProps> = FC<Props>;

const createTask = (response:TakeTaskResponseDto,taskId:string) => {

    const data = response.task;
    if(data.display === 'horizontal'){
        const {display,...others} = data;
    return toHorizontalTask({display,...others},taskId)
    }
    else{ 
        const {display,...others} = data;
        return toVerticalTask({display,...others},taskId);
    }
};



export {type BaseTask,TaskDisplay,TaskEntryType, createTask as toTask,type RenderCmp, type Task };




