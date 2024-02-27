import React, { FC } from "react"
import { CreateExerciseProps, TakeExercise as TaskExercise } from "../../Exercise/ExerciseTypes";
import { Box, Button, Stack, Text, Title, TitleOrder } from "@mantine/core";
import { PositiveInt, PositiveIntHelper } from "../../../types/primitives/PositiveInteger";
import { VerticalGroup, VerticalTask } from "./VerticalTask";
import { addOneToOrder } from "../../../utils/utils";
import { ResourcesCmp } from "../components/ResourcesCmp";
import { EvaluateTaskRequest } from "../../../api/dtos/request";


type Exercise = Pick<TaskExercise,'type'|'renderCmp'>;

type Group = Pick<VerticalGroup,'type'|'members'|'numOfExercises'|'resources'>;

interface Props {
    task: VerticalTask,
    order:TitleOrder,
    onSubmit?:(values:EvaluateTaskRequest['exercises']) => void
}

const renderExercise = (exercise: Exercise, props: CreateExerciseProps) => {
    return exercise.renderCmp(props);
}

const renderGroup = (group: Group, { order, num, key }: { order: TitleOrder, num: PositiveInt, key?: React.Key }) => {
    return (
        <Box key={key}>
            {group.resources.length >= 1 && <Box mb={'lg'}>
                <Title mb={'xs'} order={order}>{`Zdroje k cvičením ${num} - ${num + group.numOfExercises - 1}`}</Title>
                <ResourcesCmp order={addOneToOrder(order)} resources={group.resources} />
            </Box>
            }
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

const VerticalCmp: FC<Props> = ({ task:taskArg,order,onSubmit }) => {
    const taskRef = React.useRef(taskArg);
    const task = taskRef.current;
    const onFormSubmit = React.useCallback<React.FormEventHandler<HTMLFormElement>>(
        (e) => {
            console.log("VerticalCmp - formSubmit");
            e.preventDefault();
        const data = task.getFilledDataForServer();
        onSubmit && onSubmit(data);
        console.log(`DataForServer: ${JSON.stringify(data,null,2)}`);
    },[task,onSubmit]);
    
    let  exerNum = 1 as PositiveInt;
    return (
        <>
            <Title order={order}>{task.name}</Title>
            <Text>{task.description}</Text>
            <Box mt={'lg'} component={'form'} onSubmit={onFormSubmit}>
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
                <Button type={'submit'}>Odeslat</Button>
            </Box>
            
        </>
    )
};

export { VerticalCmp, type Props as VerticalCmpProps };
