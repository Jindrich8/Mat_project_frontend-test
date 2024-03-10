/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiController } from "../../../types/composed/apiController";
import { apiGet } from "../../../utils/api";
import { TaskListErrorResponseDetails } from "../../dtos/errors/error_response";
import { ListTasksRequest } from "../../dtos/request";
import { ListTasksResponse } from "../../dtos/success_response";

const listTasks = async(request: ListTasksRequest,controller:ApiController) =>{
  const response = await apiGet<
  ListTasksRequest,
  ListTasksResponse,
  TaskListErrorResponseDetails
  >
  (`/api/task/list`,request,controller);
  return response;
};

export { listTasks};