import { FillInBlanksMethods } from "./Exercises/FillInBlanks/FillInBlanks";
import { TakeExerciseDto, ActualExercise } from "./ExerciseTypes";

export const ExerciseTypeToCreator= {
    ['FillInBlanks']: FillInBlanksMethods,
    ['FixErrors']:FillInBlanksMethods,
    
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   } satisfies Record<TakeExerciseDto['details']['exerType'],ActualExercise>;