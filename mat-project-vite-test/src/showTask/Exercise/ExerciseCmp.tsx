import { FC } from "react"
import { ExerciseInstructionsCmp } from "../ExerciseInstructions";
import { Box, Group, Title } from "@mantine/core";
import { ExerciseContent, ExerciseContentCmpProps, ExerciseInstructions } from "../ExerciseBase";
import { BasicStyledCmpProps } from "../../types/props/props";
import styles from "./ExerciseStyle.module.css"

interface Props extends ExerciseContentCmpProps, BasicStyledCmpProps  {
num:number
instructions:ExerciseInstructions
content:ExerciseContent
}


const ExerciseCmp:FC<Props> = ({num,content,style,instructions,apiRef}) => {
  return (
    <Box className={styles.wrapper} style={style}>
      <Box>
        <Group gap={'xs'}>
        <Title order={2} >{num}</Title>
        <ExerciseInstructionsCmp instructions={instructions} />
        </Group>
      </Box>
      <Box>
        {content.renderCmp({ apiRef: apiRef })}
      </Box>
    </Box>
  )
};

export { ExerciseCmp,type ExerciseInstructions,type ExerciseContent, type Props as ExerciseProps };
