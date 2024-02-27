import { renderHorizontalEntry } from "./HorizontalEntry/HorizontalEntry";
import { createResource } from "../Resource/Resource";
import { Resource } from "../Resource/ResourceTypes";
import { TaskDisplay, BaseTask } from "../Task";
import { TakeExercise } from "../../Exercise/ExerciseTypes";
import { createTakeExercise } from "../../Exercise/Exercise";
import { TakeTaskDto, TakeTaskEntryDto } from "../types";
import { TitleOrder } from "@mantine/core";
import { PositiveInt } from "../../../types/primitives/PositiveInteger";

interface HorizontalTask extends BaseTask{
entries:HorizontalTaskEntry[],
display:typeof TaskDisplay.Horizontal
}

interface HorizontalTaskEntry {
    resources:Resource[]
    exercise:TakeExercise,
    renderCmp(props:{num:PositiveInt,order:TitleOrder}): JSX.Element;
    getFilledDataForServer:TakeExercise['getFilledDataForServer']
}

type TakeHorizontalTaskDto = TakeTaskDto & {display:'horizontal'};

 const toHorizontalEntryInner = (entry:TakeTaskEntryDto,resources:string[]):HorizontalTaskEntry|HorizontalTaskEntry[] => {
    if(entry.type === "exercise"){
     return {
         resources:resources.map((resource) => createResource(resource)),
         exercise:createTakeExercise(entry),
         renderCmp({num,order}) {
             return renderHorizontalEntry({
             exercise:this.exercise,
             resources:this.resources,
             num:num,
             order:order
         });
     },
     getFilledDataForServer(...props) {
         return this.exercise.getFilledDataForServer(...props);
     },
    } satisfies HorizontalTaskEntry;
}
    else{
    return entry.entries.flatMap(e => 
        toHorizontalEntryInner(e,[...resources, ...entry.resources.map(r=>r.content)])
        );
    }
 }

const toHorizontalEntry = (entry:TakeTaskEntryDto) => {
   return toHorizontalEntryInner(entry,[]);
}

const toHorizontalTask = (task:TakeHorizontalTaskDto,taskId:string):HorizontalTask =>{
return {
    id:taskId,
    name:task.task_detail.name,
    version:task.task_detail.version,
    display:TaskDisplay.Horizontal,
    description:task.task_detail.description ?? '',
    entries:task.entries.flatMap(entry => toHorizontalEntry(entry)),
        getFilledDataForServer() {
            return this.entries.map(entry => entry.getFilledDataForServer());
        },
}
}
export {toHorizontalTask,type HorizontalTask,type HorizontalTaskEntry};