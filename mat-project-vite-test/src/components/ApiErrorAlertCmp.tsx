import React, { FC } from "react"
import { BasicStyledCmpProps } from "../types/props/props";
import { ErrorAlertCmp } from "./ErrorAlertCmp";
import { Accordion, AccordionControl, AccordionItem, AccordionPanel, Code, Text} from "@mantine/core";
import { ApplicationErrorInformation } from "../api/dtos/errors/error_response";
import { ImmutableObject } from "@hookstate/core";
interface Props extends BasicStyledCmpProps {
error:ApplicationErrorInformation|ImmutableObject<ApplicationErrorInformation>|undefined,
status:number,
statusText:string
}

const ApiErrorAlertCmp:FC<Props> = React.memo(({error,status,statusText,...baseProps}) => {
  const codeAndData = React.useMemo(()=> ({
    code:error && error.details.code + '',
    data:error && JSON.stringify(error.details.errorData,undefined,4)
  })
    ,[error]);
  return (
    <ErrorAlertCmp {...baseProps}>
      <Text>Error ({status}): {statusText}</Text>
      {error && (<>
      <Text>Message: {error.user_info.message}</Text>
      {error?.user_info.description 
      && (<Text>Description: {error.user_info.description}</Text>)
      }
      <Text>Code: {codeAndData.code}</Text>
      <Accordion defaultChecked={false}>
        <AccordionItem value={codeAndData.code ?? ''}>
          <AccordionControl>
            Data
          </AccordionControl>
          <AccordionPanel>
            <Code>{codeAndData.data}</Code>
          </AccordionPanel>
         
        </AccordionItem>
      </Accordion>
      </>)}
      </ErrorAlertCmp>
  );
});
ApiErrorAlertCmp.displayName = "ApiErrorAlertCmp";

export { ApiErrorAlertCmp, type Props as ApiErrorAlertCmpProps };
