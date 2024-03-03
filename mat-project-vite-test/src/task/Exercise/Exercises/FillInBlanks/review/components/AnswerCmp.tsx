
import React, { FC } from "react"
import { AnswerTextCmp } from "../../../../../../components/AnswerText/AnswerTextCmp";

interface Props {
userText:string;
correctText?:string;
}

const AnswerCmp:FC<Props> = React.memo((props) => {
  return (<AnswerTextCmp {...props}/>);
});
AnswerCmp.displayName = "AnswerCmp";

export { AnswerCmp, type Props as AnswerCmpProps };
