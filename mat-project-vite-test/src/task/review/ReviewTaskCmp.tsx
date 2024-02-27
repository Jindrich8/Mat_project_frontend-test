import React, { FC, useEffect } from "react"
import { Box, Loader, Stack } from "@mantine/core";
import { BasicStyledCmpProps } from "../../types/props/props";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { getTaskReview } from "../../api/task/review/get";
import { ApiController } from "../../types/composed/apiController";
import { ReviewDisplay, toReview } from "./Review";
import { HorizontalReviewCmp } from "./Horizontal/HorizontalReviewCmp";
import { VerticalReviewCmp } from "./Vertical/VerticalReviewCmp";
import { useErrorResponse } from "../../utils/hooks";
import { ReviewTaskResponse } from "../../api/dtos/success_response";

type Props = {reviewId:string,reviewDto?:ReviewTaskResponse} & BasicStyledCmpProps;

const getTaskReviewController = new ApiController();

const ReviewTaskCmp:FC<Props> = ({reviewId,reviewDto,style,...baseProps}) => {
    const [review,setReview] = React.useState(
      reviewDto ? toReview(reviewDto,reviewId) : undefined
      );
    const [reviewError,setReviewError] = useErrorResponse<typeof getTaskReview>();
    console.log("ReviewTaskCmp refresh");
    console.log("Has review - "+(review ? "true" : "false"));


    useEffect(() => {
      const fetchReview = async (reviewId:string) => {
        console.log("Fetching review");
        const response = await getTaskReview(null,reviewId,getTaskReviewController);
        if(response.success){
        setReview(toReview(response.body.data,reviewId));
        }
        else if(response.isServerError){
          setReviewError({
            status:response.status,
            statusText:response.statusText,
            error:response.error?.error
          });
        }
      };
        if(review === undefined && reviewId !== undefined){
          fetchReview(reviewId);
        }
    },[reviewId,review,setReviewError]);
  return (
    <Stack style={{boxSizing:'border-box',maxHeight:'100vh',...style}} {...baseProps}>
    <Box style={{flexGrow:1,paddingBottom:'1rem'}}>
      {reviewError ? (
      <ApiErrorAlertCmp 
      status={reviewError.status}
      statusText={reviewError.statusText}
      error={reviewError.error}/>
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
