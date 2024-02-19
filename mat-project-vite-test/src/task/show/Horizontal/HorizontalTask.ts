import { OutShowResource} from "../../../api/task/take/get";
import { PositiveInt } from "../../../types/primitives/PositiveInteger";
import { BasicProps } from "../../../types/props/props";
import { createExercise } from "../Exercise/Exercise";
import { Exercise } from "../Exercise/ExerciseTypes";
import { renderHorizontalEntry } from "./HorizontalEntry/HorizontalEntry";
import { createResource } from "../Resource/Resource";
import { Resource } from "../Resource/ResourceTypes";
import { TaskDisplay, RenderCmp, BaseTask } from "../Task";
import { TitleOrder } from "@mantine/core";
import { TakeTaskResponse } from "../../../api/dtos/task/take/response";

interface HorizontalTask extends BaseTask{
entries:HorizontalTaskEntry[],
display:typeof TaskDisplay.Horizontal
}

interface HorizontalTaskEntry{
    resources:Resource[],
    exercise:Exercise,
    renderCmp:RenderCmp<{num:PositiveInt,order:TitleOrder} & BasicProps>,
    getFilledDataForServer:Exercise['getFilledDataForServer']
}

 const toHorizontalEntryInner = (entry:TakeTaskResponse['task']['entries'][0],resources:OutShowResource[]):HorizontalTaskEntry|HorizontalTaskEntry[] => {
    if(entry.type === "exercise"){
     return {
         resources:resources.map((resource) => createResource(resource)),
         exercise:createExercise(entry),
         renderCmp({num,key,order}) {
             return renderHorizontalEntry({
             exercise:this.exercise,
             key:key,
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
    return entry.entries.flatMap(e => toHorizontalEntryInner(e,[...resources, ...entry.resources]));
    }
 }

const toHorizontalEntry = (entry:TakeTaskResponse['task']['entries'][0]) => {
   return toHorizontalEntryInner(entry,[]);
}

const toHorizontalTask = (task:(TakeTaskResponse['task'] & {display:'horizontal'}),taskId:string):HorizontalTask =>{
return {
    id:taskId,
    name:task.name,
    display:TaskDisplay.Horizontal,
    description:task.description,
    entries:task.entries.flatMap(entry => toHorizontalEntry(entry)),
        getFilledDataForServer() {
            return this.entries.map(entry => entry.getFilledDataForServer());
        },
}
}
export {toHorizontalTask,type HorizontalTask,type HorizontalTaskEntry};