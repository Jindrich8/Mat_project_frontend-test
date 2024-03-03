import React, { FC, useEffect } from "react"
import { Box, Loader, Stack } from "@mantine/core";
import { BasicStyledCmpProps } from "../../types/props/props";
import { ApiErrorAlertCmp } from "../../components/ApiErrorAlertCmp";
import { getTaskReview } from "../../api/task/review/get";
import { ReviewDisplay, toReview } from "./Review";
import { HorizontalReviewCmp } from "./Horizontal/HorizontalReviewCmp";
import { VerticalReviewCmp } from "./Vertical/VerticalReviewCmp";
import { useErrorResponse } from "../../utils/hooks";
import { useLocation, useParams } from "react-router-dom";
import { createAuthApiController } from "../../components/Auth/auth";

type Props =  BasicStyledCmpProps;

const getTaskReviewController = createAuthApiController();

const ReviewTaskCmp:FC<Props> = ({style,...baseProps}) => {
  const { reviewId } = useParams();
    const location = useLocation();
  //  const authState = useAuthContext();
    const reviewFromLoc = React.useMemo(()=>{
     const dto = location.state?.reviewDto;
     return dto ? toReview(dto) : undefined;
    },[location]); 
    const [reviewFromApi,setReviewFromApi] = React.useState(
      undefined as (typeof reviewFromLoc)
      );

    const review = React.useMemo(
      ()=>reviewFromApi ?? reviewFromLoc,
    [reviewFromApi,reviewFromLoc]
    );
    const [reviewError,setReviewError] = useErrorResponse<typeof getTaskReview>();

    const clearReviewError = React.useCallback(() => {
      setReviewError(undefined);
  },[setReviewError]);
    console.log("ReviewTaskCmp refresh");
    console.log("Has review - "+(review ? "true" : "false"));


    useEffect(() => {
      const fetchReview = async (reviewId:string) => {
        console.log("Fetching review");
        const response = await getTaskReview(null,reviewId,getTaskReviewController);
        if(response.success){
        setReviewFromApi(toReview(response.body.data));
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

    const reviewToDisplay = review ?? reviewFromLoc;
  return (
    <Stack style={{boxSizing:'border-box',maxHeight:'100vh',...style}} {...baseProps}>
    <Box style={{flexGrow:1,paddingBottom:'1rem'}}>
      {reviewError ? (
      <ApiErrorAlertCmp 
      status={reviewError.status}
      statusText={reviewError.statusText}
      error={reviewError.error}
      onClose={clearReviewError}
      />
      ) : (
        !reviewToDisplay ? <Loader />
        : (reviewToDisplay.display === ReviewDisplay.Horizontal ? 
          <HorizontalReviewCmp task={reviewToDisplay} order={2} /> : 
          <VerticalReviewCmp task={reviewToDisplay} order={2} />)
      )}
      </Box>
    </Stack>
  )
};

export { ReviewTaskCmp, type Props as ReviewTaskCmpProps };
