/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiController } from "../../../types/composed/apiController";
import { apiGet } from "../../../utils/api";
import { TaskTakeErrorResponseDetails } from "../../dtos/errors/error_response";
import { TakeTaskRequest } from "../../dtos/request";
import { TakeTaskResponse } from "../../dtos/success_response";

const takeTask = async(request: TakeTaskRequest,id:string,controller:ApiController) =>{
  const response = await apiGet<
  TakeTaskRequest,
  TakeTaskResponse,
  TaskTakeErrorResponseDetails
  >
  (`/api/task/${id}/take`,request,controller);
  return response;
}

export { takeTask};