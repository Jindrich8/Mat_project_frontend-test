/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react"
import { ReviewTaskCmp } from "../../task/review/ReviewTaskCmp";

interface Props {

}

const Review: FC<Props> = () => {

  return (
    <>
      <ReviewTaskCmp
        style={{ flexGrow: 1, padding: '3rem 1rem', boxSizing: 'border-box' }}
      />
    </>
  )
};

export { Review, type Props as ReviewProps };
