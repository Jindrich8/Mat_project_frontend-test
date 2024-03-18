import { Alert, AlertProps } from "@mantine/core";
import { FC } from "react"
import { BasicStyledWChildrenCmpProps } from "../../types/props/props";

interface Props extends  BasicStyledWChildrenCmpProps{
    withCloseButton?:boolean,
    onClose?:AlertProps['onClose']
}

const SuccessAlertCmp:FC<Props> = ({withCloseButton,onClose,...base}) => {
  return (
    <Alert withCloseButton={withCloseButton} onClose={onClose} {...base} />
  );
};

export { SuccessAlertCmp, type Props as SuccessAlertCmpProps };
