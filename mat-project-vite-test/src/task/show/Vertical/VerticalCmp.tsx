import React, { FC } from "react"
import { Box, Button, Stack, Title, TitleOrder } from "@mantine/core";
import { PositiveInt, PositiveIntHelper } from "../../../types/primitives/PositiveInteger";
import { VerticalTask } from "./VerticalTask";
import { addOneToOrder } from "../../../utils/utils";
import { EvaluateTaskRequest } from "../../../api/dtos/request";
import { VerticalGroupCmp } from "../../components/VerticalGroupCmp";
import { FormattedTextCmp } from "../../../components/FormattedText/FormattedTextCmp";

interface Props {
    task: VerticalTask,
    order: TitleOrder,
    onSubmit?: (values: EvaluateTaskRequest['exercises']) => void
}
const VerticalCmp: FC<Props> = React.memo(({ task: taskArg, order, onSubmit }) => {
    const taskRef = React.useRef(taskArg);
    const task = taskRef.current;
    const onFormSubmit = React.useCallback<React.FormEventHandler<HTMLFormElement>>(
        (e) => {
            console.log("VerticalCmp - formSubmit");
            e.preventDefault();
            const data = task.getFilledDataForServer();
            onSubmit && onSubmit(data);
            console.log(`DataForServer: ${JSON.stringify(data, null, 2)}`);
        }, [task, onSubmit]);

    let exerNum = 1 as PositiveInt;
    return (
        <>
            <Stack ta={'center'} align={'center'} justify={'center'}>
                <Title order={order}>{task.name}</Title>
                <FormattedTextCmp text={task.description} />
            </Stack>
            <Box mt={'lg'} component={'form'} onSubmit={onFormSubmit}>
                <Stack>
                    {task.entries.map((entry, i) => {
                        if (entry.type === 'group') {
                            console.log(`Group: exerNum: ${exerNum}`);
                            const cmp = <VerticalGroupCmp group={entry} order={addOneToOrder(order)} num={exerNum} key={i} />;
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
                <Button type={'submit'}>Odeslat</Button>
            </Box>

        </>
    )
});
VerticalCmp.displayName = 'VerticalCmp';
export { VerticalCmp, type Props as VerticalCmpProps };
