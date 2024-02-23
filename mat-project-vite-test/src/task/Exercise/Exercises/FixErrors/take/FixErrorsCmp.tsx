import React, { FC } from "react";
import { Accordion, AccordionControl, AccordionItem, AccordionPanel, Box, Textarea } from "@mantine/core";


interface FixErrorsCmpProps {
  defaultText: string,
  state: {
    data: string|undefined,
  }
}



const FixErrorsCmp: FC<FixErrorsCmpProps> = ({ defaultText, state }) => {
  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback((e) => {
    const element = (e.target as HTMLTextAreaElement);
    state.data = element.value;
  }, [state]);
  const defaultTextLabel = 'Původní text';
  return (
    <Box w={'auto'}>
      <Accordion defaultChecked={false}>
        <AccordionItem value={defaultText}>
          <AccordionControl>
            {defaultTextLabel}
          </AccordionControl>
          <AccordionPanel>
          <Textarea
            aria-label={defaultTextLabel}
            readOnly={true}
            autosize
            value={defaultText}
          />
          </AccordionPanel>
         
        </AccordionItem>
      </Accordion>
      <Textarea
        defaultValue={state.data ?? defaultText}
        minRows={2}
        autosize
        onChange={onChange}
      />
    </Box>);
}

export { FixErrorsCmp, type FixErrorsCmpProps }