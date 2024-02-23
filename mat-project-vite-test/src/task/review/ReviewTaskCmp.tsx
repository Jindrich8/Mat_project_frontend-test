import React, { FC, useEffect, useState } from "react"
import { Box, Loader, Stack } from "@mantine/core";
import { BasicStyledCmpProps } from "../../types/props/props";
import { ApplicationErrorInformation} from "../../api/dtos/errors/error_response";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { getTaskReview } from "../../api/task/review/get";
import { ApiController } from "../../types/composed/apiController";
import { ReviewDisplay, toReview } from "./Review";
import { HorizontalReviewCmp } from "./Horizontal/HorizontalReviewCmp";
import { VerticalReviewCmp } from "./Vertical/VerticalReviewCmp";
import { HorizontalReview } from "./Horizontal/HorizontalReview";
import { VerticalReview } from "./Vertical/VerticalReview";

type Props = {reviewId:string} & BasicStyledCmpProps;

const getTaskReviewController = new ApiController();

const ReviewTaskCmp:FC<Props> = ({reviewId,style,...baseProps}) => {
  
    const [review,setReview] = React.useState(
      undefined as (HorizontalReview|VerticalReview|undefined)
      );
    const [reviewError,setReviewError] = useState<({
      status:number,
      statusText:string,
      errorResp:ApplicationErrorInformation|undefined
    }|undefined)>(undefined);

    useEffect(() => {
      const fetchReview = async (reviewId:string) => {
        const response = await getTaskReview(null,reviewId,getTaskReviewController);
        if(response.success){
        setReview(toReview(response.body.data,reviewId));
        }
        else if(response.isServerError){
          
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const {success:_,error:errorResp,...error} = response;
          setReviewError({...error,errorResp:errorResp});
        }
      };
        if(review === undefined && reviewId !== undefined){
          fetchReview(reviewId);
        }
    },[reviewId,review]);
  return (
    <Stack style={{boxSizing:'border-box',maxHeight:'100vh',...style}} {...baseProps}>
    <Box style={{flexGrow:1,paddingBottom:'1rem'}}>
      {reviewError ? (
      <ApiErrorAlertCmp 
      status={reviewError.status}
      statusText={reviewError.statusText}
      error={reviewError.errorResp}/>
      ) : (
        !review ? <Loader />
        : (review.display === ReviewDisplay.Horizontal ? 
          <HorizontalReviewCmp task={review} order={2} /> : 
          <VerticalReviewCmp task={review} order={2} />)
      )}
      </Box>
    </Stack>
  )
};

export { ReviewTaskCmp, type Props as ReviewTaskCmpProps };
