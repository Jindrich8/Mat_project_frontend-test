import{Exercise as ExerciseDto} from "../../../api/dtos/task/take/response"
import { ExerciseCmp } from "./ExerciseCmp";
import { createDoplnovacka } from "./Exercises/Doplnovacka/Doplnovacka";
import { createHledaniChyb } from "./Exercises/HledaniChyb/HledaniChyb";
import { CreateExerciseProps, Exercise } from "./ExerciseTypes";

const createExercise = (exercise:ExerciseDto):Exercise => {
  const ExerciseTypeToCreator
   = {
    ['FillInBlanks']: createDoplnovacka,
    ['FixErrors']:createHledaniChyb,
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } satisfies Record<typeof exercise.details.exerType,(content:any) => {
    renderCmp():JSX.Element,
    getFilledDataForServer:()=>unknown
  }>;
  // TODO: try to remove as
  const ExerciseTypeToCreatorDict = 
  ExerciseTypeToCreator as Record<typeof exercise.details.exerType,(content:typeof exercise.details.content) => ReturnType<typeof ExerciseTypeToCreator[keyof typeof ExerciseTypeToCreator]>>;

  
  const creater = ExerciseTypeToCreatorDict[exercise.details.exerType];
  console.log(`exercise.type: ${exercise.exerType}, creater: ${JSON.stringify(creater)}`)
    const content = ExerciseTypeToCreatorDict[exercise.details.exerType](exercise.details.content);
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