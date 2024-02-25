import { FillInBlanksMethods } from "./Exercises/FillInBlanks/FillInBlanks";
import { FixErrorsMethods } from "./Exercises/FixErrors/FixErrors";
import { TakeExerciseDto, ActualExercise } from "./ExerciseTypes";

export const ExerciseTypeToCreator= {
    ['FillInBlanks']: FillInBlanksMethods,
    ['FixErrors']:FixErrorsMethods,
    
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   } satisfies Record<TakeExerciseDto['details']['exerType'],ActualExercise>;