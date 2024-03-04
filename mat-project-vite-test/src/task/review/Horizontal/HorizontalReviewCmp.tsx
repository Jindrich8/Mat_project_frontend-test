import { Box, Button, Group, Stack, Text, Title, TitleOrder } from "@mantine/core";
import React, { FC } from "react"
import { PositiveInt } from "../../../types/primitives/PositiveInteger";
import { addOneToOrder, isNotNullNorUndef, isNullOrUndef } from "../../../utils/utils";
import { NonNegativeInt, NonNegativeIntHelper } from "../../../types/primitives/NonNegativeInteger";
import { IntHelper } from "../../../types/primitives/Integer";
import { HorizontalReview } from "./HorizontalReview";
import styles from "./HorizontalReviewStyle.module.css";
import { TaskPointsCmp } from "../../../components/TaskPointsCmp";


interface Props {
    task: HorizontalReview,
    order: TitleOrder
}

const HorizontalReviewCmp: FC<Props> = React.memo(({ task: taskArg, order }) => {
    const [currentIndex, setCurrentIndex] = React.useState<NonNegativeInt>(NonNegativeIntHelper.MIN);
    const taskRef = React.useRef(taskArg);
    const task = taskRef.current;

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
        <Stack className={styles.container} px={'xl'} h={'100%'} ml={'md'} mr={'lg'} align={'flex-start'}>
            <Stack ta={'center'} align={'center'} w={'100%'}>
            <Group mb={'xs'} className={styles.titleContainer} ta={'center'} align={'center'} justify={'center'}>
                <Title order={order}>{task.name}</Title>
                <TaskPointsCmp has={task.points.has} max={task.points.max} />
            </Group>
            <Text>{task.description}</Text>
            </Stack>
            <Box style={{overflowY: 'auto' }}>
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
});
HorizontalReviewCmp.displayName = "HorizontalReviewCmp";
export { HorizontalReviewCmp, type Props as HorizontalReviewCmpProps };
