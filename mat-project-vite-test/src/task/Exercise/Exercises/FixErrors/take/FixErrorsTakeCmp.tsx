import React, { FC } from "react";
import { Box, Textarea } from "@mantine/core";
import { DetailsCmp } from "../../../../../components/Collapse/DetailsCmp";
import { SummaryCmp } from "../../../../../components/Collapse/SummaryCmp";
import { CollapseCmp } from "../../../../../components/Collapse/CollapseCmp";


interface Props {
  defaultText: string,
  state: {
    data: string | undefined,
  }
}



const FixErrorsTakeCmp: FC<Props> = React.memo(({ defaultText, state }) => {
  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback((e) => {
    const element = (e.target as HTMLTextAreaElement);
    state.data = element.value;
  }, [state]);
  const defaultTextLabel = 'Původní text';
  return (
    <Box w={'100%'}>
      <DetailsCmp>
        <SummaryCmp>
          {defaultTextLabel}
        </SummaryCmp>
        <CollapseCmp>
          <Textarea
            aria-label={defaultTextLabel}
            readOnly={true}
            autosize
            value={defaultText}
          />
        </CollapseCmp>
      </DetailsCmp>

      <Textarea
        defaultValue={state.data ?? defaultText}
        minRows={2}
        autosize
        onChange={onChange}
      />
    </Box>);
});

FixErrorsTakeCmp.displayName = 'FixErrorsTakeCmp';

export { FixErrorsTakeCmp, type Props as FixErrorsTakeCmpProps }