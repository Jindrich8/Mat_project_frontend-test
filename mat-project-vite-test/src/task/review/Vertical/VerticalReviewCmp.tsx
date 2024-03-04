import React, { FC } from "react"
import { Box, Group, Stack, Text, Title, TitleOrder } from "@mantine/core";
import { PositiveInt, PositiveIntHelper } from "../../../types/primitives/PositiveInteger";
import { addOneToOrder } from "../../../utils/utils";
import { VerticalReview } from "./VerticalReview";
import { VerticalGroupCmp } from "../../components/VerticalGroupCmp";
import { TaskPointsCmp } from "../../../components/TaskPointsCmp";

interface Props {
    task: VerticalReview,
    order: TitleOrder
}
const VerticalReviewCmp: FC<Props> = React.memo(({ task, order }) => {
    let exerNum = 1 as PositiveInt;
    return (
        <Stack  ml={'md'} mr={'lg'}>
            <Stack ta={'center'} align={'center'} w={'100%'}>
                <Group ta={'center'} align={'center'} justify={'center'} w={'100%'}>
                    <Title order={order}>{task.name}</Title>
                    <TaskPointsCmp has={task.points.has} max={task.points.max} />
                </Group>
                <Text>{task.description}</Text>
            </Stack>
            <Box mt={'lg'} component={'form'}>
                <Stack>
                    {task.entries.map((entry, i) => {
                        if (entry.type === 'group') {
                            console.log(`Group: exerNum: ${exerNum}`);
                            const cmp = <VerticalGroupCmp
                                group={entry}
                                order={addOneToOrder(order)}
                                num={exerNum}
                                key={i}
                            />;
                            exerNum = exerNum + entry.numOfExercises as PositiveInt;
                            console.log(`Group end: exerNum: ${exerNum}`);
                            return cmp;
                        }
                        else {
                            console.log(`exerNum: ${exerNum}`);
                            const cmp = <entry.renderCmp order={order} num={exerNum} key={i} />;
                            exerNum = PositiveIntHelper.addOne(exerNum);
                            return cmp;
                        }
                    })}
                </Stack>
            </Box>

        </Stack>
    )
});
VerticalReviewCmp.displayName = 'VerticalReviewCmp';
export { VerticalReviewCmp, type Props as VerticalReviewCmpProps };
