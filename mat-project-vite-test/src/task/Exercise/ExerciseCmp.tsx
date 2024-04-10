import { FC } from "react"
import { ExerciseInstructionsCmp } from "./components/ExerciseInstructionsCmp";
import { Box, Group, Title, TitleOrder } from "@mantine/core";
import { ExerciseContent, ExerciseInstructions } from "./ExerciseTypes";
import styles from "./ExerciseStyle.module.css"
import { PositiveInt } from "../../types/primitives/PositiveInteger";
import { BasicStyledCmpProps } from "../../types/props/props";
import { ExercisePoints } from "../../api/dtos/success_response";
import { ExercisePointsCmp } from "../../components/ExercisePointsCmp";

interface Props extends BasicStyledCmpProps {
  num: PositiveInt
  instructions: ExerciseInstructions
  content: ExerciseContent
  order: TitleOrder
  points?: ExercisePoints
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ExerciseCmp: FC<Props> = ({ num, order, content, style, instructions, points }) => {
  return (
    <Box className={styles.wrapper} style={style}>
      <Box>
        {points && <ExercisePointsCmp has={points.has} max={points.max} withBorder />}

        <Group gap={'xs'} align={'flex-start'} mb={'md'}>
          <Title order={order} >{num}</Title>
          <ExerciseInstructionsCmp instructions={instructions} />
        </Group>
      </Box>
      <Group ta={'left'}>
        <content.renderCmp />
      </Group>
    </Box>
  )
};

export { ExerciseCmp, type Props as ExerciseProps };
