import { Group as VerticalGroup } from "@mantine/core";
import { TaskResponse, OutShowTaskDisplay, OutShowGroup, OutShowExercise } from "../../../api/task/show/get";
import { PositiveInt } from "../../../types/primitives/PositiveInteger";
import { createExercise } from "../Exercise/Exercise";
import { Exercise } from "../Exercise/ExerciseTypes";
import { createResource } from "../Resource/Resource";
import { BaseTask, TaskDisplay, TaskEntryType } from "../Task";
import { Resource } from "../Resource/ResourceTypes";

interface VerticalGroup{
    type: typeof TaskEntryType.Group,
    numOfExercises: PositiveInt,
    resources: Resource[],
    members: (VerticalGroup | Exercise)[]
}

interface VerticalTask extends BaseTask{
display:typeof TaskDisplay.Vertical
entries:(Exercise | VerticalGroup)[],

}

const toVerticalEntryInner = (entry:OutShowGroup|OutShowExercise,count:{value:number}):Exercise|VerticalGroup => {
    const origin = count.value;
    let transformed;
    if(entry.type === TaskEntryType.Group){
        transformed = {
        type:TaskEntryType.Group,
        resources:entry.resources.map(resource => createResource(resource)),
        members:entry.entries.map(entry => toVerticalEntryInner(entry,count)),
        numOfExercises:count.value - origin as PositiveInt,
    } satisfies VerticalGroup;
 }else{ 
    transformed = createExercise(entry);
    ++count.value;
}
    return transformed;
}

const toVerticalEntry = (entry:TaskResponse['entries'][0]):VerticalTask['entries'][0] => {
   return toVerticalEntryInner(entry,{value:0});
}

type getFilledDataForServerType = ReturnType<Exercise['getFilledDataForServer']>;

const getEntryDataForServer = (entry:VerticalTask['entries'][0],depth:number = 0):getFilledDataForServerType[] | getFilledDataForServerType =>{
console.log('depth: '+depth);
return entry.type === TaskEntryType.Group ? 
entry.members.map(e => getEntryDataForServer(e,depth+1)) : [entry.getFilledDataForServer()];
}

const toVerticalTask = (task:TaskResponse & {display:OutShowTaskDisplay.Vertical}):VerticalTask =>{
return {
    id:task.id,
    name:task.name,
    display:TaskDisplay.Vertical,
    description:task.description,
    entries:task.entries.map(entry => toVerticalEntry(entry)),
        getFilledDataForServer() {
            return this.entries.map(entry => getEntryDataForServer(entry));
        },
}
}
export {toVerticalTask,type VerticalTask,type VerticalGroup};