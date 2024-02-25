import { FC } from "react";
import { Box, Text } from "@mantine/core";
import { ExerciseReview } from "../../../../../api/dtos/success_response";


interface Props {
  data: (ExerciseReview['details'] & { exerType: 'FixErrors' })['content']

}



const FixErrorsReviewCmp: FC<Props> = ({ data }) => {
  return (<Box>{
    data.map(opt => {
      if (typeof opt === 'string') {
        return <Text span>{opt}</Text>;
      }
      else if (typeof opt.INS === 'string') {

        return <Text style={{ textDecorationLine: 'underline', textDecorationColor: 'green' }} span>{opt.INS}</Text>;
      }
      else if (typeof opt.DEL === 'string') {
        return <Text style={{ textDecorationLine: 'line-through', textDecorationColor: 'red' }} span>{opt.DEL}</Text>;
      }
      else {
        throw new Error("Unsupported action: " + JSON.stringify(opt));
      }
    })}</Box>);
}

export { FixErrorsReviewCmp, type Props as FixErrorsReviewCmpProps }