import { FC } from "react"
import { ReviewTaskCmp } from "../../task/review/ReviewTaskCmp";

interface Props {

}

const Get:FC<Props> = () => {
  return (
          <>
  <ReviewTaskCmp
  style={{flexGrow:1,padding:'3rem 1rem',boxSizing:'border-box'}} 
  />
    </>
  )
};

export { Get, type Props as GetProps };
