import { PositiveInt } from "../../../types/primitives/PositiveInteger";
import { BasicProps } from "../../../types/props/props";
import { renderHorizontalEntry } from "./HorizontalEntry/HorizontalEntry";
import { TitleOrder } from "@mantine/core";
import { ReviewTaskDto, ReviewTaskEntryDto } from "../types";
import { BaseReview, RenderCmp, ReviewDisplay } from "../Review";
import { createResource } from "../../show/Resource/Resource";
import { Resource } from "../../show/Resource/ResourceTypes";
import { createReviewExercise } from "../../Exercise/Exercise";
import { ReviewExercise } from "../../Exercise/ExerciseTypes";

interface HorizontalReview extends BaseReview{
entries:HorizontalReviewEntry[],
display:typeof ReviewDisplay.Horizontal
}

interface HorizontalReviewEntry{
    resources:Resource[],
    exercise:ReviewExercise,
    renderCmp:RenderCmp<{num:PositiveInt,order:TitleOrder} & BasicProps>,
}

type HorizontalReviewDto = ReviewTaskDto & {display:'horizontal'};

 const toHorizontalEntryInner = (entry:ReviewTaskEntryDto,resources:string[]):HorizontalReviewEntry|HorizontalReviewEntry[] => {
    if(entry.type === "exercise"){
     return {
         resources:resources.map((resource) => createResource(resource)),
         exercise:createReviewExercise(entry),
         renderCmp({num,order}) {
             return renderHorizontalEntry({
             exercise:this.exercise,
             resources:this.resources,
             num:num,
             order:order
         });
     }
    } satisfies HorizontalReviewEntry;
}
    else{
    return entry.entries.flatMap(e => 
        toHorizontalEntryInner(e,[...resources, ...entry.resources.map(r => r.content)])
        );
    }
 }

const toHorizontalEntry = (entry:ReviewTaskEntryDto) => {
   return toHorizontalEntryInner(entry,[]);
}

const toHorizontalReview = (task:HorizontalReviewDto,taskId:string):HorizontalReview =>{
return {
    id:taskId,
    name:task.name,
    display:ReviewDisplay.Horizontal,
    entries:task.entries.flatMap(entry => toHorizontalEntry(entry)),
}
}
export {toHorizontalReview,type HorizontalReview,type HorizontalReviewEntry};