import { OutShowExercise } from "../../../api/task/show/get";
import { ExerciseCmp } from "./ExerciseCmp";
import { createDoplnovacka } from "./Exercises/Doplnovacka/Doplnovacka";
import { createHledaniChyb } from "./Exercises/HledaniChyb/HledaniChyb";
import { CreateExerciseProps, Exercise, ExerciseContentFromDTO } from "./ExerciseTypes";

const createExercise = (exercise:OutShowExercise):Exercise => {
  const ExerciseTypeToCreator = {
    ["HledaniChyb"]:createHledaniChyb,
    ["Doplnovacka"]: createDoplnovacka,
  };
  
  const ExerciseTypeToCreatorDict:Record<string,ExerciseContentFromDTO> = ExerciseTypeToCreator;
  const creater = ExerciseTypeToCreatorDict[exercise.exerType];
  console.log(`exercise.type: ${exercise.exerType}, creater: ${JSON.stringify(creater)}`)
    const content = creater(exercise.content);
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


export {createExercise}