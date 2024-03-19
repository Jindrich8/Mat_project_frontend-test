
import React, { FC } from "react"
import { AnswerTextCmp } from "../../../../../../components/AnswerText/AnswerTextCmp";
import { BasicStyledCmpProps } from "../../../../../../types/props/props";

interface Props extends BasicStyledCmpProps {
userText?:string;
correctText?:string;
}

const AnswerCmp:FC<Props> = React.memo((props) => {
  return (<AnswerTextCmp {...props}/>);
});
AnswerCmp.displayName = "AnswerCmp";

export { AnswerCmp, type Props as AnswerCmpProps };
