import { TitleOrder } from "@mantine/core";
import { PositiveInt } from "../../types/primitives/PositiveInteger";
import { BasicProps } from "../../types/props/props";
import { BaseTask, RenderCmp } from "../show/Task";
import { ReviewTaskResponse, TakeTaskResponse } from "../../api/dtos/success_response";

interface ExerciseInstructions {
    instructions:string
  }

interface TakeExercise extends Exercise {
    getFilledDataForServer():ReturnType<BaseTask['getFilledDataForServer']>[0]
}

interface ReviewExercise extends Exercise{
}

interface Exercise{
  type:'exercise',
  renderCmp:RenderCmp<CreateExerciseProps>
}

interface CreateExerciseProps extends BasicProps
{
  order:TitleOrder;
  num:PositiveInt;
}

interface TakeActualExercise extends ExerciseContent{
  getFilledDataForServer:TakeExercise['getFilledDataForServer']
}

interface ReviewActualExercise extends ExerciseContent{
}


interface ExerciseContent{
  renderCmp():JSX.Element
}
type TakeExerciseDto = TakeTaskResponse['task']['entries'][0] & {type:'exercise'};
type ReviewExerciseDto = ReviewTaskResponse['task']['entries'][0] & {type:'exercise'};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CreateTake = (content:any) => TakeActualExercise;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CreateReview = (content:any) => ReviewActualExercise;

interface ActualExercise{
  createTake:CreateTake,
  createReview:CreateReview
}



export {
  type CreateExerciseProps,
  type TakeExercise, 
  type ReviewExercise,
  type ExerciseInstructions, 
  type ActualExercise,
  type TakeExerciseDto,
  type ReviewExerciseDto,
  type ExerciseContent,
  type Exercise
}




