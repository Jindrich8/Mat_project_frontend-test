import { FC } from "react";
import React from "react";
import { AnswerCmp } from "./AnswerCmp";

interface Props {
  correctValue?:string;
  userValue:string;
}

const ComboboxReviewCmp:FC<Props> = React.memo(({correctValue,userValue}) => {
  return (<AnswerCmp userText={userValue} correctText={correctValue} />);
});
ComboboxReviewCmp.displayName = 'ComboboxReviewCmp';
export { ComboboxReviewCmp, type Props as ComboboxReviewCmpProps };
