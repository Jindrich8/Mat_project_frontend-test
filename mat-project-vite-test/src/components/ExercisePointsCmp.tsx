import { Box } from "@mantine/core";
import { FC } from "react"

interface Props {
has:number;
max:number;
withBorder?:boolean;
}

const ExercisePointsCmp: FC<Props> = ({has,max,withBorder}) => {
    const style = withBorder ? { border: '1px solid black', padding: '0.4rem',borderRadius:'10px'} : undefined;
    return (
        <Box ml={'auto'} mr={'lg'} pr={'lg'} ta={'end'}>
            <span style={style}>~{(has.toFixed(2))} / {max.toFixed(2)}b</span>
        </Box>
    )
};

export { ExercisePointsCmp, type Props as ExercisePointsCmpProps };
