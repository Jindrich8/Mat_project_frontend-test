import { Exercise as TakeExerciseDto } from "../../api/dtos/success_response";
import { ExerciseReview as ReviewExerciseDto } from "../../api/dtos/success_response";
import { ExerciseCmp } from "./ExerciseCmp";
import {CreateExerciseProps, ReviewExercise, TakeExercise } from "./ExerciseTypes";
import { ExerciseTypeToCreator } from "./Exercises";




const createTakeExercise = (exercise:TakeExerciseDto):TakeExercise=> {
  const creater = ExerciseTypeToCreator[exercise.details.exerType].createTake
  console.log(`exercise.type: ${exercise.exerType}, creater: ${JSON.stringify(creater)}`)
    const content = creater(exercise.details.content);
 return {
  type:'exercise',
  getFilledDataForServer:() => content.getFilledDataForServer(),
   renderCmp: ({order,...props}:CreateExerciseProps) => {
    
    return (<ExerciseCmp 
    content={content}
    order={order}
    {...props}
    instructions={{instructions:exercise.instructions.content}}
    /> );
  }
 }
}

const createReviewExercise = (exercise:ReviewExerciseDto):ReviewExercise=> {
  const creater = ExerciseTypeToCreator[exercise.details.exerType].createReview;
  console.log(`exercise.type: ${exercise.exerType}, creater: ${JSON.stringify(creater)}`)
    const content = creater(exercise.details.content);
 return {
  type:'exercise',
   renderCmp: ({order,...props}:CreateExerciseProps) => {
    
    return (<ExerciseCmp 
    content={content}
    order={order}
    {...props}
    instructions={{instructions:exercise.instructions.content}}
    /> );
  }
 }
}


export {createTakeExercise,createReviewExercise};