import { FC } from "react";
import React from "react";
import { AnswerCmp } from "./AnswerCmp";

interface Props {
  correctValue?:string;
  userValue:string;
}

const TextInputReviewCmp:FC<Props> = React.memo(({correctValue,userValue}) => {
  return (<AnswerCmp userText={userValue} correctText={correctValue} />);
});
TextInputReviewCmp.displayName = 'TextInputReviewCmp';
export { TextInputReviewCmp, type Props as TextInputReviewCmpProps };
