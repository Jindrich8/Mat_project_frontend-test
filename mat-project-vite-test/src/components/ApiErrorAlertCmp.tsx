import { FC } from "react"
import { BasicStyledCmpProps } from "../types/props/props";
import { ErrorAlertCmp, ErrorAlertCmpProps } from "./ErrorAlertCmp";
import { Button, Text } from "@mantine/core";
import { ApplicationErrorInformation } from "../api/dtos/errors/error_response";
import { useDisclosure } from "@mantine/hooks";
import { JsonViewCmp } from "./JsownView/JsonViewCmp";
import { ModalCmp } from "./Modal/ModalCmp";
interface Props extends BasicStyledCmpProps {
  error?: ApplicationErrorInformation,
  status: number,
  statusText: string
  onClose:ErrorAlertCmpProps['onClose'],
  withoutCloseButton?:boolean
}

const ApiErrorAlertCmp: FC<Props> = ({ error, status, statusText,onClose,withoutCloseButton, ...baseProps }) => {
  const [opened, { open,close }] = useDisclosure(false);
  return (
    <ErrorAlertCmp withCloseButton={!withoutCloseButton ?? true} onClose={onClose} {...baseProps}>
      <Text span>{statusText}({status}):</Text>
      {error && <>
        <Text>Message: {error.user_info.message}</Text>
        {error.user_info.description && <Text>Description: {error.user_info.description}</Text>}
        {error.details && <Text>Code: {error.details.code}</Text>}
        {error.details?.errorData !== undefined && <Button onClick={open}>Data</Button>}
        </>
      }
        <ModalCmp
          opened={opened}
          onClose={close}
          title="Error data"
          centered
          >
            <JsonViewCmp json={error?.details?.errorData} />
        </ModalCmp>
    </ErrorAlertCmp>
  );
};

export { ApiErrorAlertCmp, type Props as ApiErrorAlertCmpProps };
