import { FC } from "react"
import { ReviewTaskCmp } from "../../task/review/ReviewTaskCmp";

interface Props {

}

const GetReview:FC<Props> = () => {
  return (
  <ReviewTaskCmp
  style={{flexGrow:1,paddingTop:'3rem',paddingBottom:0,paddingRight:'1rem',paddingLeft:'1rem',boxSizing:'border-box'}} 
  />
  )
};

export { GetReview, type Props as GetReviewProps };
