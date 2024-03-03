import { ApiController } from "../../../types/composed/apiController";
import { apiPost } from "../../../utils/api";
import { TaskEvaluateErrorResponseDetails } from "../../dtos/errors/error_response";
import { EvaluateTaskRequest } from "../../dtos/request";
import { ReviewTaskResponse } from "../../dtos/success_response";


export const evaluateTask = (id:string,request:EvaluateTaskRequest,controller:ApiController) => {
    return apiPost<
    EvaluateTaskRequest,
    ReviewTaskResponse,
    TaskEvaluateErrorResponseDetails
    >
    (`/api/task/${id}/evaluate`,request,controller);
};
