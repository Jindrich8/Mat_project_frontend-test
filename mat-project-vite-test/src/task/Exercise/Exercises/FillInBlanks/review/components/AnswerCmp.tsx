import { Badge } from "@mantine/core";
import React, { FC } from "react"

interface Props {
userText:string;
correctText?:string;
}

const AnswerCmp:FC<Props> = React.memo((props) => {
  return (<Badge><AnswerCmp {...props}/></Badge>);
});
AnswerCmp.displayName = "AnswerCmp";

export { AnswerCmp, type Props as AnswerCmpProps };
