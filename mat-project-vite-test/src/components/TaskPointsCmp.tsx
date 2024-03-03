import React, { FC } from "react"
import { BasicStyledCmpProps } from "../types/props/props";
import { Box, Group } from "@mantine/core";
import { ExercisePointsCmp } from "./ExercisePointsCmp";

interface Props extends BasicStyledCmpProps {
  has: number;
  max: number;
}

const TaskPointsCmp: FC<Props> = ({ has, max, ...rest }) => {
  return (
    <Group {...rest}>
      <ExercisePointsCmp has={has} max={max} />
      <Box ml={'auto'} mr={'lg'} pr={'lg'} ta={'end'}>
        <span style={{ border: '1px solid black', padding: '0.25rem' }}>
          <strong>
            {'~'}{(has / max * 100).toFixed(2)}%
          </strong>
        </span>
      </Box>
    </Group>
  )
};

export { TaskPointsCmp, type Props as TaskPointsCmpProps };
