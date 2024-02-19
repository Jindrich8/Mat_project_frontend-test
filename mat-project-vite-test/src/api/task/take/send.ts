import { apiPost } from "../../../utils/api";
import { TaskEvaluteErrorResponseDetails } from "../../dtos/task/evaluate/error";
import { EvaluateTaskRequest } from "../../dtos/task/evaluate/request";
import { EvaluateTaskResponse } from "../../dtos/task/evaluate/response";


export const evaluateTask = (id:string,request:EvaluateTaskRequest) => {
    return apiPost<
    EvaluateTaskRequest,
    EvaluateTaskResponse,
    TaskEvaluteErrorResponseDetails
    >
    (`/api/task/${id}/evaluate`,request);
};
