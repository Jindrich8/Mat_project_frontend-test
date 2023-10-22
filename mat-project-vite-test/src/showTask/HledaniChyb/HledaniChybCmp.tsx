import React, { FC } from "react";
import { ExerciseContentCmpProps } from "../ExerciseBase";
import { Box, Textarea } from "@mantine/core";


interface HledaniChybCmpProps extends ExerciseContentCmpProps {
    data:string;
    defaultFilledData?:string;
}


const HledaniChybCmp: FC<HledaniChybCmpProps> = ({ data: text,apiRef,defaultFilledData }) => {

    const data = React.useRef<string|undefined>(undefined);


    const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback((e) => {
        const element = (e.target as HTMLTextAreaElement);
       data.current = element.value;
    }, [data]);
    apiRef.getFilledDataForServer = () => data.current;

    return (
        <Box style={{width:'auto'}}>
            <Textarea
            defaultValue={defaultFilledData ?? text}
            minRows={2}
            autosize
            onChange={onChange}
             />
        </Box>);
}

export { HledaniChybCmp, type HledaniChybCmpProps }