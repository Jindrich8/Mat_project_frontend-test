import { FC } from "react"
import { PositiveInt } from "../../../../types/primitives/PositiveInteger";
import { Stack, Box, TitleOrder } from "@mantine/core";
import { BasicProps } from "../../../../types/props/props";
import { Exercise } from "../../Exercise/ExerciseTypes";
import { Resource } from "../../Resource/ResourceTypes";
import { ResourcesCmp } from "../../components/ResourcesCmp";

interface Props extends BasicProps {
    resources:Pick<Resource,'renderCmp'>[],
    exercise:Pick<Exercise,'renderCmp'>,
    num:PositiveInt,
    order:TitleOrder
}

const HorizontalEntryCmp:FC<Props> = ({exercise,resources,num,order}) => {
  console.log(order);
  return (
    <Stack>
      <ResourcesCmp resources={resources} order={order} />
        <Box>
            {exercise.renderCmp({num:num,order:order})}
        </Box>
    </Stack>
  )
};

export { HorizontalEntryCmp, type Props as HorizontalEntryCmpProps };
