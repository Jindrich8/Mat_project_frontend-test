import React, { FC } from "react"
import styles from "./AnswerTextCmpStyle.module.css"

interface Props {
userText:string;
correctText?:string;
}

const AnswerTextCmp:FC<Props> = React.memo(({userText,correctText}) => {


    const userTextIsIncorrect =correctText !== undefined && userText !== correctText;
    const incorrectText = userTextIsIncorrect ? userText : '';
  return (<span className={styles.container}>
   <span
    className={styles.incorrectText}
    data-empty={incorrectText ? 'false' : 'true'}
    data-correct={userTextIsIncorrect}
    >{incorrectText}</span>
    <span className={styles.middle}>/</span>
    <span
    className={styles.correctText}
    >{correctText ?? userText}</span>
    </span>
  )
});
AnswerTextCmp.displayName = "AnswerTextCmp";

export { AnswerTextCmp, type Props as AnswerTextCmpProps };
