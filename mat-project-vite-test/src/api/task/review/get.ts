import { ApiController } from "../../../types/composed/apiController";
import { apiGet } from "../../../utils/api";
import { TaskReviewGetErrorResponseDetails } from "../../dtos/errors/error_response";
import { GetTaskReviewRequest, TaskReviewDetailRequest } from "../../dtos/request";
import { ReviewTaskResponse } from "../../dtos/success_response";

export const getTaskReview = async(request: GetTaskReviewRequest,id:string,controller:ApiController) =>{
    const response = await apiGet<
    GetTaskReviewRequest,
    ReviewTaskResponse,
    TaskReviewGetErrorResponseDetails
    >
    (`/api/review/${id}/get`,request,controller);
    return response;
  }

  export const getTaskReviewDetail  =async(request: TaskReviewDetailRequest,id:string,controller:ApiController) =>{
    const response = await apiGet<
    TaskReviewDetailRequest,
    ReviewTaskResponse,
    TaskReviewGetErrorResponseDetails
    >
    (`/api/review/${id}/get`,request,controller);
    return response;
  }