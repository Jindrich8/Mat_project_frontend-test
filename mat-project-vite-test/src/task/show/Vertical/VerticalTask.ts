import { Group as VerticalGroup } from "@mantine/core";
import { PositiveInt } from "../../../types/primitives/PositiveInteger";
import { createExercise } from "../Exercise/Exercise";
import { Exercise } from "../Exercise/ExerciseTypes";
import { createResource } from "../Resource/Resource";
import { BaseTask, TaskDisplay, TaskEntryType } from "../Task";
import { Resource } from "../Resource/ResourceTypes";
import { TakeTaskResponse } from "../../../api/dtos/task/take/response";

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

const toVerticalEntryInner = (entry:TakeTaskResponse['task']['entries'][0],count:{value:number}):Exercise|VerticalGroup => {
    const origin = count.value;
    let transformed;
    if(entry.type === 'group'){
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

const toVerticalEntry = (entry:TakeTaskResponse['task']['entries'][0]):VerticalTask['entries'][0] => {
   return toVerticalEntryInner(entry,{value:0});
}

type getFilledDataForServerType = ReturnType<Exercise['getFilledDataForServer']>;

const getEntryDataForServer = (entry:VerticalTask['entries'][0],depth:number = 0):getFilledDataForServerType[] =>{
    const data:getFilledDataForServerType[] = [];
    const stack = [];
console.log('depth: '+depth);
let actualEntry:typeof entry|undefined = entry;
do{
  if(actualEntry.type === TaskEntryType.Group){
    stack.unshift(...actualEntry.members);
  }
  else{
    data.push(actualEntry.getFilledDataForServer());
  }
}while((actualEntry = stack.shift()));
console.log(`data: ${JSON.stringify(data)}`);
return data;
}

const toVerticalTask = (task:TakeTaskResponse['task'] & {display:'vertical'},taskId:string):VerticalTask =>{
return {
    id:taskId,
    name:task.name,
    display:TaskDisplay.Vertical,
    description:task.description,
    entries:task.entries.map(entry => toVerticalEntry(entry)),
        getFilledDataForServer() {
            const data = [];
            for(const entry of this.entries){
                data.push(...getEntryDataForServer(entry));
            }
            return data;
        },
}
}
export {toVerticalTask,type VerticalTask,type VerticalGroup};