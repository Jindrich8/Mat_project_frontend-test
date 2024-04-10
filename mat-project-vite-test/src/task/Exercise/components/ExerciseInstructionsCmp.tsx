import { FC } from "react"
import { ExerciseInstructions } from "../ExerciseTypes";
import { FormattedTextCmp } from "../../../components/FormattedText/FormattedTextCmp";

interface Props {
   instructions:ExerciseInstructions
}

const ExerciseInstructionsCmp:FC<Props> = ({instructions}) => {
  return (
        <FormattedTextCmp text={instructions.instructions} />
  );
};

export { ExerciseInstructionsCmp, type Props as InstructionsProps };
