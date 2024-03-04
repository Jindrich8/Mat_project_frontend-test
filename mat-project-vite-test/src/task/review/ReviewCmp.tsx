import React, { FC } from "react"
import { Review } from "./Review";
import { Box, TitleOrder } from "@mantine/core";
import { HorizontalReviewCmp } from "./Horizontal/HorizontalReviewCmp";
import { VerticalReviewCmp } from "./Vertical/VerticalReviewCmp";

interface Props {
    review: Review;
    order: TitleOrder;
}

const ReviewCmp: FC<Props> = React.memo(({ review,order }) => {
    return (<Box style={{display:'flex',flexDirection:'column',flexGrow:1}}>{review.display === 'horizontal' ?
        <HorizontalReviewCmp task={review} order={order} /> :
        <VerticalReviewCmp task={review} order={order} />
    }</Box>
    );
});
ReviewCmp.displayName = 'ReviewCmp';

export { ReviewCmp, type Props as ReviewCmpProps };
