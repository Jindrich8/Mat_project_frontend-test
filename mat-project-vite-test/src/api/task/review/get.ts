import { ApiController } from "../../../types/composed/apiController";
import { apiGet } from "../../../utils/api";
import { ReviewDetailErrorResponseDetails, TaskReviewGetErrorResponseDetails, TaskReviewListErrorResponseDetails } from "../../dtos/errors/error_response";
import { GetTaskReviewRequest, ListTaskReviewsRequest, TaskReviewDetailRequest } from "../../dtos/request";
import { ListTaskReviewsResponse, ReviewTaskResponse, TaskReviewDetailResponse } from "../../dtos/success_response";

export const getTaskReview = async(request: GetTaskReviewRequest,id:string,controller:ApiController) =>{
    const response = await apiGet<
    GetTaskReviewRequest,
    ReviewTaskResponse,
    TaskReviewGetErrorResponseDetails
    >
    (`/api/review/${id}/get`,request,controller);
    return response;
  }

  export const getTaskReviewDetail  =async(id:string,controller:ApiController) =>{
    const response = apiGet<
    TaskReviewDetailRequest,
    TaskReviewDetailResponse,
    ReviewDetailErrorResponseDetails
    >
    (`/api/review/${id}/detail`,null,controller);
    return response;
  }

  export const listTaskReviews = async(request:ListTaskReviewsRequest,controller:ApiController) =>{
    const response = apiGet<
    ListTaskReviewsRequest,
    ListTaskReviewsResponse,
    TaskReviewListErrorResponseDetails
    >
    (`/api/review/list`,request,controller);
    return response;
  }