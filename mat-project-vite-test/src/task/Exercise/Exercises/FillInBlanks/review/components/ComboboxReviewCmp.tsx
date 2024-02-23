import { FC } from "react";
import React from "react";
import { AnswerTextCmp } from "./AnswerTextCmp";

interface Props {
  correctValue?:string;
  userValue:string;
}

const ComboboxReviewCmp:FC<Props> = React.memo(({correctValue,userValue}) => {
  return (<AnswerTextCmp userText={userValue} correctText={correctValue} />);
});
ComboboxReviewCmp.displayName = 'ComboboxReviewCmp';
export { ComboboxReviewCmp, type Props as ComboboxReviewCmpProps };
