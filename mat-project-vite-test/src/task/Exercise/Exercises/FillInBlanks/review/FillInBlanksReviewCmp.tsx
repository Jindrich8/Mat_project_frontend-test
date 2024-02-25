import React, { FC } from "react";
import { Group } from "@mantine/core";
import styles from "../FillInBlanksCmpStyle.module.css"
import { ComboboxReviewCmp } from "./components/ComboboxReviewCmp";
import { TextInputReviewCmp } from "./components/TextInputReviewCmp";
import { ReviewContent } from "../FillInBlanks";


type Content = ReviewContent;

interface FillInBlanksReviewCmpProps {
    uiData: Content;
}

const FillInBlanksReviewCmp: FC<FillInBlanksReviewCmpProps> = React.memo(({ uiData }) => {
    return (
        <Group
            className={styles.cmpsContainer}
            gap={0}
            wrap={'wrap'}
            align={'center'}>
            {uiData.map((d, i) => {
                return (typeof d === 'string' ?
                    <span className={styles.textCmp} key={i}>{d}</span>
                    : (
                        d.type === 'cmb' ?
                            (<ComboboxReviewCmp
                                userValue={d.userValue}
                                key={i}
                                correctValue={d.correctValue}
                            />)
                            : (<TextInputReviewCmp
                                userValue={d.userValue}
                                key={i}
                                correctValue={d.correctValue}
                            />)
                    )
                );
            })}
        </Group>
    );
});
FillInBlanksReviewCmp.displayName = 'FillInBlanksReviewCmp';
export { FillInBlanksReviewCmp, type FillInBlanksReviewCmpProps }