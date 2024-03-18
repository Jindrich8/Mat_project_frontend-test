/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiController } from "../../../types/composed/apiController";
import { apiPut } from "../../../utils/api";
import { TaskUpdateErrorDetails } from "../../dtos/errors/error_response";
import { TaskUpdateRequest } from "../../dtos/request";
import { TaskUpdateResponse } from "../../dtos/success_response";

const updateTask = async(request: TaskUpdateRequest,id:string,controller:ApiController) =>{
  const response = await apiPut<
  TaskUpdateRequest,
  TaskUpdateResponse,
  TaskUpdateErrorDetails
  >
  (`/api/task/${id}/update`,request,controller);
  return response;
}

export { updateTask};