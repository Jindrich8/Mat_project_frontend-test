import { Group as VerticalGroup } from "@mantine/core";
import { PositiveInt } from "../../../types/primitives/PositiveInteger";
import { createResource } from "../Resource/Resource";
import { BaseTask, TaskDisplay, TaskEntryType } from "../Task";
import { Resource } from "../Resource/ResourceTypes";
import { createTakeExercise } from "../../Exercise/Exercise";
import { TakeExercise } from "../../Exercise/ExerciseTypes";
import { TakeTaskDto, TakeTaskEntryDto } from "../types";

interface VerticalGroup{
    type: typeof TaskEntryType.Group,
    numOfExercises: PositiveInt,
    resources: Resource[],
    members: (VerticalGroup | TakeExercise)[]
}

interface VerticalTask extends BaseTask{
display:typeof TaskDisplay.Vertical
entries:(TakeExercise | VerticalGroup)[],

}

type TakeVerticalTaskDto = TakeTaskDto&{display:'vertical'};

const toVerticalEntryInner = (entry:TakeTaskEntryDto,context:{count:number,exercises:TakeExercise[]}):TakeExercise|VerticalGroup => {
    const origin = context.count;
    let transformed;
    if(entry.type === 'group'){
        transformed = {
        type:TaskEntryType.Group,
        resources:entry.resources.map(resource => createResource(resource.content)),
        members:entry.entries.map(entry => toVerticalEntryInner(entry,context)),
        numOfExercises:context.count - origin as PositiveInt,
    } satisfies VerticalGroup;
 }else{ 
    transformed = createTakeExercise(entry);
    context.exercises.push(transformed);
    ++context.count;
}
    return transformed;
}

const toVerticalEntry = (entry:TakeTaskEntryDto,exercises:TakeExercise[]):VerticalTask['entries'][0] => {
   return toVerticalEntryInner(entry,{count:0,exercises});
}

const toVerticalTask = (task:TakeVerticalTaskDto,taskId:string):VerticalTask =>{
    const exercises:TakeExercise[] = [];
    return {
    id:taskId,
    name:task.task_detail.name,
    version:task.task_detail.version,
    display:TaskDisplay.Vertical,
    description:task.task_detail.description ?? '',
    entries:task.entries.map(entry => toVerticalEntry(entry,exercises)),
        getFilledDataForServer:() => {
            return exercises.map(e => e.getFilledDataForServer());
        }
}
};


export {toVerticalTask,type VerticalTask,type VerticalGroup};