import React, { FC } from "react"
import { ReviewTaskCmp } from "../../task/review/ReviewTaskCmp";
import { useParams } from "react-router-dom";

interface Props {

}

const Get:FC<Props> = () => {
    const { reviewId } = useParams();
  return (
          <>
  <ReviewTaskCmp
  style={{flexGrow:1,padding:'3rem 1rem',boxSizing:'border-box'}} 
  reviewId={reviewId ?? ''} 
  />
    </>
  )
};

export { Get, type Props as GetProps };
