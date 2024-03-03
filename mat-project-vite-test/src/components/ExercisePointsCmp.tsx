import { Box } from "@mantine/core";
import React, { FC } from "react"

interface Props {
has:number;
max:number;
}

const ExercisePointsCmp: FC<Props> = ({has,max}) => {
    return (
        <Box ml={'auto'} mr={'lg'} pr={'lg'} ta={'end'}>
            <span style={{ border: '1px solid black', padding: '0.25rem' }}>~{(has.toFixed(2))} / {max.toFixed(2)}b</span>
        </Box>
    )
};

export { ExercisePointsCmp, type Props as ExercisePointsCmpProps };
