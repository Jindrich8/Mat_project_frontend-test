import { FC } from "react"
import { ExerciseInstructionsCmp } from "./components/ExerciseInstructionsCmp";
import { Box, Group, Title, TitleOrder } from "@mantine/core";
import { ExerciseContent, ExerciseInstructions } from "./ExerciseTypes";
import styles from "./ExerciseStyle.module.css"
import { BasicStyledCmpProps } from "../../../types/props/props";
import { PositiveInt } from "../../../types/primitives/PositiveInteger";

interface Props extends BasicStyledCmpProps  {
num:PositiveInt
instructions:ExerciseInstructions
content:ExerciseContent
order:TitleOrder
}


const ExerciseCmp:FC<Props> = ({num,order,content,style,instructions}) => {
  return (
    <Box className={styles.wrapper} style={style}>
      <Box>
        <Group gap={'xs'}>
        <Title order={order} >{num}</Title>
        <ExerciseInstructionsCmp instructions={instructions} />
        </Group>
      </Box>
      <Box>
        {content.renderCmp({})}
      </Box>
    </Box>
  )
};

export { ExerciseCmp, type Props as ExerciseProps };
