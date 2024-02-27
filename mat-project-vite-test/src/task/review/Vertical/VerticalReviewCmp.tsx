import React, { FC } from "react"
import { CreateExerciseProps, ReviewExercise as TaskExercise } from "../../Exercise/ExerciseTypes";
import { Box, Stack, Title, TitleOrder } from "@mantine/core";
import { PositiveInt, PositiveIntHelper } from "../../../types/primitives/PositiveInteger";
import { VerticalReview, VerticalReviewGroup } from "./VerticalReview";
import { addOneToOrder } from "../../../utils/utils";
import { ResourcesCmp } from "../../show/components/ResourcesCmp";

type Exercise = Pick<TaskExercise,'type'|'renderCmp'>;

type Group = Pick<VerticalReviewGroup,'type'|'members'|'numOfExercises'|'resources'>;

interface Props {
    task: VerticalReview,
    order:TitleOrder
}

const renderExercise = (exercise: Exercise, props: CreateExerciseProps) => {
    return exercise.renderCmp(props);
}

const renderGroup = (group: Group, { order, num, key }: { order: TitleOrder, num: PositiveInt, key?: React.Key }) => {
    return (
        <Box key={key}>
            <Title mb={'xs'} order={order}>{`Zdroje k cvičením ${num} - ${num + group.numOfExercises - 1}`}</Title>
                <ResourcesCmp order={addOneToOrder(order)} resources={group.resources} />
            <Stack>
                {group.members.map((member, i) =>{

                    const cmp = member.type === 'exercise' ?
                        renderExercise(member, {
                            key: i,
                            order,
                            num: num
                        })
                        : renderGroup(group, {
                            key: i,
                            order: addOneToOrder(order),
                            num: num
                        });
                        num = PositiveIntHelper.addOne(num);
                        return cmp;
                        })}
            </Stack>
        </Box>);
}

const VerticalReviewCmp: FC<Props> = ({ task,order }) => {
    let  exerNum = 1 as PositiveInt;
    return (
        <>
            <Title order={order}>{task.name}</Title>
            <Box>
                <Stack>
                    {task.entries.map((entry, i) => {
                        if (entry.type === 'group') {
                            console.log(`Group: exerNum: ${exerNum}`);
                            const cmp = renderGroup(entry, {
                                order: addOneToOrder(order),
                                num: exerNum,
                                key: i
                            });
                            exerNum = exerNum + entry.numOfExercises as PositiveInt;
                            console.log(`Group end: exerNum: ${exerNum}`);
                            return cmp;
                        }
                        else {
                            console.log(`exerNum: ${exerNum}`);
                            const cmp =  renderExercise(entry, {
                                order: addOneToOrder(order),
                                num: exerNum,
                                key: i
                            });
                            exerNum = PositiveIntHelper.addOne(exerNum);
                           return cmp;
                        }
                    })}
                </Stack>
            </Box>
        </>
    )
};

export { VerticalReviewCmp, type Props as VerticalReviewCmpProps };
