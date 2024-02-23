import { FC } from "react";
import React from "react";
import { AnswerTextCmp } from "./AnswerTextCmp";

interface Props {
  correctValue?:string;
  userValue:string;
}

const TextInputReviewCmp:FC<Props> = React.memo(({correctValue,userValue}) => {
  return (<AnswerTextCmp userText={userValue} correctText={correctValue} />);
});
TextInputReviewCmp.displayName = 'TextInputReviewCmp';
export { TextInputReviewCmp, type Props as TextInputReviewCmpProps };
