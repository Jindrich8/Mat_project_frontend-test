import React, { FC } from "react";
import styles from "../FillInBlanksCmpStyle.module.css"
import { ReviewContent } from "../FillInBlanks";
import { AnswerCmp } from "./components/AnswerCmp";
import { strStartAndEndWsToNbsp } from "../../../../../utils/utils";


type Content = ReviewContent;

interface FillInBlanksReviewCmpProps {
    uiData: Content;
}

const FillInBlanksReviewCmp: FC<FillInBlanksReviewCmpProps> = React.memo(({ uiData }) => {
    return (
        <span style={{display:'inline',textAlign:'left'}}>
            {uiData.map((d, i) => {
                return (typeof d === 'string' ?
                    <span className={styles.textCmp} key={i}>{strStartAndEndWsToNbsp(d)}</span>
                    : (<AnswerCmp 
                        style={{verticalAlign:'middle'}} 
                        userText={d.userValue ?? undefined} 
                        key={i} 
                        correctText={d.correctValue} />
                    )
                );
            })}
        </span>
    );
});
FillInBlanksReviewCmp.displayName = 'FillInBlanksReviewCmp';
export { FillInBlanksReviewCmp, type FillInBlanksReviewCmpProps }