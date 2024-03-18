/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiController } from "../../../types/composed/apiController";
import { apiGet } from "../../../utils/api";
import { TaskMyListErrorResponseDetails } from "../../dtos/errors/error_response";
import { ListMyTasksRequest } from "../../dtos/request";
import { ListMyTasksResponse } from "../../dtos/success_response";

const listMyTasks = async(request: ListMyTasksRequest,controller:ApiController) =>{
  const response = await apiGet<
  ListMyTasksRequest,
  ListMyTasksResponse,
  TaskMyListErrorResponseDetails
  >
  (`/api/my_task/list`,request,controller);
  return response;
};

export { listMyTasks};