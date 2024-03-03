import { FC } from "react"
import { BasicStyledWChildrenCmpProps } from "../types/props/props";
import { Alert, AlertProps } from "@mantine/core";

interface Props extends  BasicStyledWChildrenCmpProps{
withCloseButton?:boolean,
onClose?:AlertProps['onClose']
}

const ErrorAlertCmp:FC<Props> = ({withCloseButton,onClose,...props}) => {
  return (
   <Alert color={'red'} onClose={onClose} withCloseButton={withCloseButton} {...props} />
  )
};

export { ErrorAlertCmp, type Props as ErrorAlertCmpProps };
