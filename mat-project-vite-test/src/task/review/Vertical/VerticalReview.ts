import { PositiveInt } from "../../../types/primitives/PositiveInteger";
import { ReviewTaskResponse} from "../../../api/dtos/success_response";
import { ReviewExercise } from "../../Exercise/ExerciseTypes";
import { createResource } from "../../show/Resource/Resource";
import { Resource } from "../../show/Resource/ResourceTypes";
import { TaskDisplay } from "../../show/Task";
import { createReviewExercise } from "../../Exercise/Exercise";
import { BaseReview } from "../Review";

interface VerticalReviewGroup{
    type: 'group',
    numOfExercises: PositiveInt,
    resources: Resource[],
    members: (VerticalReviewGroup | ReviewExercise)[]
}

interface VerticalReview extends BaseReview{
display:typeof TaskDisplay.Vertical
entries:(ReviewExercise | VerticalReviewGroup)[],

}

type DtoEntry = ReviewTaskResponse['task']['entries'][0];

const toVerticalEntryInner = (entry:DtoEntry,context:{count:number,exercises:ReviewExercise[]}):ReviewExercise|VerticalReviewGroup => {
    const origin = context.count;
    let transformed;
    if(entry.type === 'group'){
        transformed = {
        type:'group',
        resources:entry.resources.map(resource => createResource(resource.content)),
        members:entry.entries.map(entry => toVerticalEntryInner(entry,context)),
        numOfExercises:context.count - origin as PositiveInt,
    } satisfies VerticalReviewGroup;
 }else{ 
    transformed = createReviewExercise(entry);
    context.exercises.push(transformed);
    ++context.count;
}
    return transformed;
}

const toVerticalEntry = (entry:DtoEntry,exercises:ReviewExercise[]):VerticalReview['entries'][0] => {
   return toVerticalEntryInner(entry,{count:0,exercises});
}

const toVerticalReview = (task:ReviewTaskResponse['task'] & {display:'vertical'},taskId:string):VerticalReview =>{
    const exercises:ReviewExercise[] = [];
    return {
    id:taskId,
    name:task.name,
    display:TaskDisplay.Vertical,
    entries:task.entries.map(entry => toVerticalEntry(entry,exercises))
}
};


export {toVerticalReview,type VerticalReview,type VerticalReviewGroup};