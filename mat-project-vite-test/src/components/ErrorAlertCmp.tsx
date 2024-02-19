import React, { FC } from "react"
import { BasicStyledWChildrenCmpProps } from "../types/props/props";
import { Alert } from "@mantine/core";

interface Props extends  BasicStyledWChildrenCmpProps{

}

const ErrorAlertCmp:FC<Props> = ({...props}) => {
  return (
   <Alert color={'red'} {...props} />
  )
};

export { ErrorAlertCmp, type Props as ErrorAlertCmpProps };
