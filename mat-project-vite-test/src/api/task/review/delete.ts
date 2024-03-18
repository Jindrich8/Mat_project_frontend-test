import { ApiController } from "../../../types/composed/apiController";
import { apiDelete } from "../../../utils/api";
import { ReviewDeleteErrorResponseDetails } from "../../dtos/errors/error_response";
import { DeleteTaskReviewResponse } from "../../dtos/success_response";

export const deleteReview = async (id:string,controller:ApiController) => {
    const response = apiDelete<
    DeleteTaskReviewResponse,
    ReviewDeleteErrorResponseDetails
    >
    (`/api/review/${id}/delete`,controller);
    return response;
  };