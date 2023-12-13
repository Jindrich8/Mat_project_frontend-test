import React, { FC } from "react";
import { Box, Textarea } from "@mantine/core";


interface HledaniChybCmpProps {
  state:{data?:string;}
}



const HledaniChybCmp: FC<HledaniChybCmpProps> = ({ state }) => {
    const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback((e) => {
        const element = (e.target as HTMLTextAreaElement);
       state.data = element.value;
    }, [state]);

    return (
        <Box w={'auto'}>
            <Textarea
            defaultValue={state.data}
            minRows={2}
            autosize
            onChange={onChange}
             />
        </Box>);
}

export { HledaniChybCmp, type HledaniChybCmpProps }