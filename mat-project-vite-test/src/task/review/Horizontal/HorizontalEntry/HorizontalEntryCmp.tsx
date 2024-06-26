import React, { FC } from "react"
import { PositiveInt } from "../../../../types/primitives/PositiveInteger";
import { Stack, Box, TitleOrder } from "@mantine/core";
import { BasicProps } from "../../../../types/props/props";
import { Resource } from "../../../show/Resource/ResourceTypes";
import { ResourcesCmp } from "../../../show/components/ResourcesCmp";
import { ReviewExercise } from "../../../Exercise/ExerciseTypes";

interface Props extends BasicProps {
    resources:Pick<Resource,'renderCmp'>[],
    exercise:Pick<ReviewExercise,'renderCmp'>,
    num:PositiveInt,
    order:TitleOrder
}

const HorizontalEntryCmp:FC<Props> = React.memo(({exercise,resources,num,order}) => {
  console.log(order);
  return (
    <Stack>
      <ResourcesCmp resources={resources} order={order} />
        <Box>
          <exercise.renderCmp num={num} order={order} />
        </Box>
    </Stack>
  )
});
HorizontalEntryCmp.displayName = "HorizontalEntryCmp";
export { HorizontalEntryCmp, type Props as HorizontalEntryCmpProps };
