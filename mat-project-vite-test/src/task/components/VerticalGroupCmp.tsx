import React, { FC } from "react"
import { Box, Stack, Title, TitleOrder } from "@mantine/core";
import { PositiveInt, PositiveIntHelper } from "../../types/primitives/PositiveInteger";
import { addOneToOrder } from "../../utils/utils";
import { ResourcesCmp } from "../show/components/ResourcesCmp";
import { Exercise} from "../Exercise/ExerciseTypes";
import { Resource } from "../show/Resource/ResourceTypes";

type Group ={
    type: 'group',
    numOfExercises: PositiveInt,
    resources: Resource[],
    members:(Group|Exercise)[]
};
interface Props {
group:Group,
order:TitleOrder,
num:PositiveInt,
}

const VerticalGroupCmp:FC<Props> = React.memo(({group,order,num}) => {
    // Is not needed
    const titleText = React.useMemo(()=>
    `Zdroje k cvičením ${num} - ${num + group.numOfExercises - 1}`,
    [group.numOfExercises, num]
    );
  return (<Box>
            {group.resources.length >= 1 && <Box mb={'lg'}>
                <Title mb={'xs'} order={order}>{titleText}</Title>
                <ResourcesCmp order={addOneToOrder(order)} resources={group.resources} />
            </Box>
            }
            <Stack>
                {group.members.map((member, i) =>{
                    const cmp = member.type === 'exercise' ?
                    <member.renderCmp key={i} order={order} num={num} />
                        : <VerticalGroupCmp group={member} key={i} order={addOneToOrder(order)} num={num} />
                        num = PositiveIntHelper.addOne(num);
                        return cmp;
                        })}
            </Stack>
        </Box>
  );
});
VerticalGroupCmp.displayName = "VerticalGroupCmp";
export { VerticalGroupCmp, type Props as VerticalGroupCmpProps };
