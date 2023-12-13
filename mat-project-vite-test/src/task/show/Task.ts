import { FC } from "react";
import { OutShowTaskDisplay, TaskResponse } from "../../api/task/show/get";
import { BasicProps } from "../../types/props/props";
import { ExerciseContentFromDTO} from "./Exercise/ExerciseTypes";
import { HorizontalTask, toHorizontalTask } from "./Horizontal/HorizontalTask";
import { VerticalTask, toVerticalTask } from "./Vertical/VerticalTask";


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

const createTask = (data:TaskResponse) => {

    if(data.display === OutShowTaskDisplay.Horizontal){
        const {display,...others} = data;
    return toHorizontalTask({display,...others})
    }
    else{ 
        const {display,...others} = data;
        return toVerticalTask({display,...others});
    }
};

export {type BaseTask,TaskDisplay,TaskEntryType, createTask as toTask,type RenderCmp, type Task, type ExerciseContentFromDTO };




