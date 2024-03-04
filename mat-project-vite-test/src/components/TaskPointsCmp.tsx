import React, { FC } from "react"
import { BasicStyledCmpProps } from "../types/props/props";
import { Box, Group, Text } from "@mantine/core";
import { ExercisePointsCmp } from "./ExercisePointsCmp";

interface Props extends BasicStyledCmpProps {
  has: number;
  max: number;
}

const TaskPointsCmp: FC<Props> = ({ has, max, ...rest }) => {
  return (
    <Group {...rest} fz={'lg'} style={{border:'1px solid black',padding:'0.25rem',borderRadius:'10px'}}>
      <ExercisePointsCmp has={has} max={max} />
      <Box ml={'auto'} mr={'lg'} pr={'lg'} ta={'end'}>
        <Text variant={'text'} size={'lg'}>
          <strong>
            {'~'}{(has / max * 100).toFixed(2)}%
          </strong>
        </Text>
      </Box>
    </Group>
  )
};

export { TaskPointsCmp, type Props as TaskPointsCmpProps };
