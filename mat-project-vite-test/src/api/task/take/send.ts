import { ApiController } from "../../../types/composed/apiController";
import { apiPost } from "../../../utils/api";
import { TaskEvaluteErrorResponseDetails } from "../../dtos/errors/error_response";
import { EvaluateTaskRequest } from "../../dtos/request";
import { EvaluateTaskResponse } from "../../dtos/success_response";


export const evaluateTask = (id:string,request:EvaluateTaskRequest,controller:ApiController) => {
    return apiPost<
    EvaluateTaskRequest,
    EvaluateTaskResponse,
    TaskEvaluteErrorResponseDetails
    >
    (`/api/task/${id}/evaluate`,request,controller);
};
