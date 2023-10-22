import { Text } from "@mantine/core";
import { FC } from "react"
import { ExerciseInstructions } from "./Exercise/ExerciseCmp";

interface Props {
   instructions:ExerciseInstructions
}

const ExerciseInstructionsCmp:FC<Props> = ({instructions}) => {
  return (
    <>
        <Text>{instructions.instructions}</Text>
    </>
  )
};

export { ExerciseInstructionsCmp, type Props as InstructionsProps };
