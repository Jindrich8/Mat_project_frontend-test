import { TitleOrder } from "@mantine/core";
import { PositiveInt } from "../../../types/primitives/PositiveInteger";
import { BasicProps } from "../../../types/props/props";
import { RenderCmp } from "../Task";

interface ExerciseInstructions {
    instructions:string
  }
  
  interface ExerciseContent {
    getFilledDataForServer():unknown|undefined
    renderCmp:RenderCmp<BasicProps>
  }

interface Exercise {
    type:'exercise',
    getFilledDataForServer():unknown|undefined
    renderCmp:RenderCmp<CreateExerciseProps>
}

interface CreateExerciseProps extends BasicProps
{
  order:TitleOrder;
  num:PositiveInt;
}

type ExerciseContentFromDTO = (content:unknown) => ExerciseContent;

export {type ExerciseContentFromDTO,type CreateExerciseProps,type Exercise, type ExerciseInstructions, type ExerciseContent}




