import React, { FC } from "react";
import { Box, Text } from "@mantine/core";
import { ExerciseReview } from "../../../../../api/dtos/success_response";
import styles from "./FixErrorsReviewCmpStyle.module.css"


interface Props {
  data: (ExerciseReview['details'] & { exerType: 'FixErrors' })['content']

}

const FixErrorsReviewCmp: FC<Props> = React.memo(({ data }) => {
  return (<Box ta={'left'}>{
    data.map((opt,i) => {
      if (typeof opt === 'string') {
        return <Text key={i} span>{opt}</Text>;
      }
      else if (opt.action === 'INS') {
        return <Text  key={i} className={styles.insert} span>{opt.value}</Text>;
      }
      else if (opt.action === 'DEL') {
        return <Text key={i} className={styles.delete} span>{opt.value}</Text>;
      }
      else {
        throw new Error("Unsupported action: " + JSON.stringify(opt));
      }
    })}</Box>);
});
FixErrorsReviewCmp.displayName = "FixErrorsReviewCmp";

export { FixErrorsReviewCmp, type Props as FixErrorsReviewCmpProps }