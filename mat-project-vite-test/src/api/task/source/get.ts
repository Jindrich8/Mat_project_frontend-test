/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiController } from "../../../types/composed/apiController";
import { apiGet } from "../../../utils/api";
import { TaskSourceErrorResponseDetails } from "../../dtos/errors/error_response";
import { TaskSourceRequest } from "../../dtos/request";
import { TaskSourceResponse } from "../../dtos/success_response";

const getTaskSource = async(request: TaskSourceRequest,id:string,controller:ApiController) =>{
  const response = await apiGet<
  TaskSourceRequest,
  TaskSourceResponse,
  TaskSourceErrorResponseDetails
  >
  (`/api/task/${id}/source`,request,controller);
  return response;
};

export { getTaskSource};