import { Box, Button, Group, Stack, Text, Title, TitleOrder } from "@mantine/core";
import React, { FC } from "react"
import { PositiveInt } from "../../../types/primitives/PositiveInteger";
import { addOneToOrder, isNotNullNorUndef, isNullOrUndef } from "../../../utils/utils";
import { NonNegativeInt, NonNegativeIntHelper } from "../../../types/primitives/NonNegativeInteger";
import { IntHelper } from "../../../types/primitives/Integer";
import { HorizontalTask } from "./HorizontalTask";
import { EvaluateTaskRequest } from "../../../api/dtos/request";

interface Props {
    task: HorizontalTask,
    order: TitleOrder,
    onSubmit?: (values: EvaluateTaskRequest['exercises']) => void
}

const HorizontalCmp: FC<Props> = ({ task: taskArg, order, onSubmit }) => {
    const [currentIndex, setCurrentIndex] = React.useState<NonNegativeInt>(NonNegativeIntHelper.MIN);
    const taskRef = React.useRef(taskArg);
    const task = taskRef.current;
    const onFormSubmit = React.useCallback<React.FormEventHandler>((e) => {
        e.preventDefault();
        const data = task.getFilledDataForServer();
        onSubmit && onSubmit(data);
        console.log(`DataForServer: ${JSON.stringify(data, null, 2)}`);
    }, [task, onSubmit]);

    const onClick = React.useCallback<React.MouseEventHandler<HTMLDivElement>>((e) => {
        if (e.target instanceof HTMLElement) {
            let target = e.target as HTMLElement;
            while (isNullOrUndef(target.dataset.index)) {
                if (isNullOrUndef(target.parentElement) || isNotNullNorUndef(target.dataset?.['index-stop'])) return;
                target = target.parentElement;
            }
            const index = target.dataset.index;
            setCurrentIndex(NonNegativeIntHelper.fromInt(IntHelper.parse(index)));
        }
    }, []);

    const currentEntry = task.entries[currentIndex];

    return (
        <Stack h={'100%'}  justify={'stretch'} style={{ flexGrow:1, boxSizing: 'border-box', maxHeight: '100vh', padding: 0 }} px={'xl'} 
        component={'form'}
        display={'flex'}
        onSubmit={onFormSubmit}>
            <Box>
                <Group mb={'xs'} ta={'center'} align={'center'} justify={'center'}>
                    <Title order={order}>{task.name}</Title>
                    <Text>{task.description}</Text>
                </Group>
                <Button type={'submit'} style={{ float: 'right' }}>Odeslat</Button>
            </Box>
            <Box style={{ flexGrow: 1, overflowY: 'auto' }}
                
            >
                <currentEntry.renderCmp
                    num={currentIndex + 1 as PositiveInt}
                    order={addOneToOrder(order)}
                />
            </Box>
            <div style={{marginTop:'auto'}} data-index-stop onClick={onClick}>
                <Button.Group >
                    {task.entries.map((_, i) => 
                    <Button key={i} data-index={i} variant={'filled'}>
                        <span data-index={i}>{i + 1}</span>
                        </Button>
                        )}
                </Button.Group>
            </div>
        </Stack>
    )
};

export { HorizontalCmp, type Props as HorizontalCmpProps };
