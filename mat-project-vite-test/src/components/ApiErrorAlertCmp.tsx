import { FC } from "react"
import { BasicStyledCmpProps } from "../types/props/props";
import { ErrorAlertCmp } from "./ErrorAlertCmp";
import { Button, Code, Modal, Text } from "@mantine/core";
import { ApplicationErrorInformation } from "../api/dtos/errors/error_response";
import { useDisclosure } from "@mantine/hooks";
interface Props extends BasicStyledCmpProps {
  error?: ApplicationErrorInformation,
  status: number,
  statusText: string
}

const ApiErrorAlertCmp: FC<Props> = ({ error, status, statusText, ...baseProps }) => {
  const [opened, { open,close }] = useDisclosure(false);
  return (
    <ErrorAlertCmp {...baseProps}>
      <Text span>{statusText}({status}):</Text>
      {error && <>
        <Text>Message: {error.user_info.message}</Text>
        {error.user_info.description && <Text>Description: {error.user_info.description}</Text>}
        {error.details && <Text>Code: {error.details.code}</Text>}
        {error.details?.errorData !== undefined && <Button onClick={open}>Data</Button>}
        </>
      }
        <Modal
          opened={opened}
          onClose={close}
          title="Error data"
          centered
          >
          <Code>{JSON.stringify(error?.details?.errorData, undefined, 8)}</Code>
        </Modal>
    </ErrorAlertCmp>
  );
};

export { ApiErrorAlertCmp, type Props as ApiErrorAlertCmpProps };
