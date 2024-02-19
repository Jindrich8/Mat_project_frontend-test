import React, { FC } from "react"
import { BasicStyledCmpProps } from "../types/props/props";
import { ApiError } from "../types/composed/apiError";
import { ErrorAlertCmp } from "./ErrorAlertCmp";
import { Text } from "@mantine/core";

interface Props extends BasicStyledCmpProps {
error:ApiError
}

const ApiErrorAlertCmp:FC<Props> = ({error,...baseProps}) => {
  return (
    <ErrorAlertCmp {...baseProps}>
      <Text>Error ({error.status}): {error.statusText}</Text>
      <Text>Message: {error.message}</Text>
      {error.description && <Text>Description: {error.description}</Text>}
      </ErrorAlertCmp>
  );
};

export { ApiErrorAlertCmp, type Props as ApiErrorAlertCmpProps };
