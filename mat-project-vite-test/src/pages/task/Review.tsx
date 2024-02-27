/* eslint-disable @typescript-eslint/no-unused-vars */
import  { FC } from "react"
import { useLocation, useParams } from "react-router-dom";
import { ReviewTaskCmp } from "../../task/review/ReviewTaskCmp";
import { Title } from "@mantine/core";
import { dump } from "../../utils/utils";

interface Props {

}

const Review:FC<Props> = () => {
    const { reviewId } = useParams();
    const location = useLocation();
    const reviewDto = location.state?.reviewDto;
    console.log("review " + reviewId);
    console.log(dump(location));
  return (
    <>
    <Title>Review</Title>
    {
      location !== undefined
    }
  {/* <ReviewTaskCmp
  style={{flexGrow:1,padding:'3rem 1rem',boxSizing:'border-box'}} 
  reviewId={reviewId ?? ''} 
  reviewDto={reviewDto}
  /> */}
    </>
  )
};

export { Review, type Props as ReviewProps };
