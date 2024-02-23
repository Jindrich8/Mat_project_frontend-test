import { Text } from "@mantine/core";
import React, { FC } from "react"
import styles from "./AnswerTextCmpStyle.module.css"

interface Props {
userText:string;
correctText?:string;
}

const AnswerTextCmp:FC<Props> = React.memo(({userText,correctText}) => {
    const userTextIsIncorrect =correctText && userText !== correctText;
  return (<span>
   {userTextIsIncorrect && <Text 
    inline={true} 
    span={true}
    className={styles.incorrectText}
    >{userText}</Text>}
    <Text 
    inline={true} 
    span={true}
    className={styles.correctText}
    >{correctText ?? userText}</Text>
    </span>
  )
});
AnswerTextCmp.displayName = "AnswerTextCmp";

export { AnswerTextCmp, type Props as AnswerTextCmpProps };
