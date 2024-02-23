import { Box, Button,Stack,Text, Title, TitleOrder } from "@mantine/core";
import React, { FC } from "react"
import { PositiveInt } from "../../../types/primitives/PositiveInteger";
import { addOneToOrder, isNotNullNorUndef, isNullOrUndef } from "../../../utils/utils";
import { NonNegativeInt, NonNegativeIntHelper } from "../../../types/primitives/NonNegativeInteger";
import { IntHelper } from "../../../types/primitives/Integer";
import { HorizontalTask } from "./HorizontalTask";

interface Props {
    task: HorizontalTask,
    order:TitleOrder
}

const HorizontalCmp: FC<Props> = ({ task:taskArg,order }) => {
    const [currentIndex, setCurrentIndex] = React.useState<NonNegativeInt>(NonNegativeIntHelper.MIN);
    const taskRef = React.useRef(taskArg);
    const task = taskRef.current;
    const onSubmit = React.useCallback(() => {
        console.log(`DataForServer: ${JSON.stringify(task.getFilledDataForServer(),null,2)}`);
    },[task]);

    const onClick = React.useCallback<React.MouseEventHandler<HTMLDivElement>>((e) => {
        if (e.target instanceof HTMLElement) {
            let target = e.target as HTMLElement;
            while(isNullOrUndef(target.dataset.index)) {
                if(isNullOrUndef(target.parentElement) || isNotNullNorUndef(target.dataset?.['index-stop']))return;
                target = target.parentElement;
            }
            const index = target.dataset.index;
                setCurrentIndex(NonNegativeIntHelper.fromInt(IntHelper.parse(index)));
        }
    }, []);
    return (
        <Stack h={'100%'} style={{boxSizing:'border-box',maxHeight:'100vh',padding:0}} px={'xl'}>
        <Box>
        <Box mb={'xs'} style={{float:'left'}}>
         <Title order={order}>{task.name}</Title>
            <Text>{task.description}</Text>
            </Box>
            <Button type={'submit'} style={{float:'right'}} onClick={onSubmit} >Odeslat</Button>
            </Box>
            <Box style={{flexGrow:1,overflowY:'auto'}}>
                {task.entries[currentIndex].renderCmp({ 
                    num:  currentIndex + 1 as PositiveInt,
                     order: addOneToOrder(order)})}
            </Box>
            <div data-index-stop  onClick={onClick}>
                <Button.Group >
                    {task.entries.map((_, i) => <Button key={i} data-index={i} variant={'filled'}><span data-index={i}>{i + 1}</span></Button>)}
                </Button.Group>
            </div>
        </Stack>
    )
};

export { HorizontalCmp, type Props as HorizontalCmpProps };
