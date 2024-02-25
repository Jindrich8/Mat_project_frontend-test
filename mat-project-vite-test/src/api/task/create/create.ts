import { ApiController } from '../../../types/composed/apiController';
import { apiPost } from '../../../utils/api';
import { TaskCreateErrorResponseDetails } from '../../dtos/errors/error_response';
import { TaskCreateRequest } from '../../dtos/request';
import { TaskCreateResponse } from '../../dtos/success_response';

const createTask = async (request:TaskCreateRequest,controller:ApiController) => {
  const response = apiPost<
  TaskCreateRequest,
  TaskCreateResponse,
  TaskCreateErrorResponseDetails
  >
  ("/api/task/create",request,controller);
  return response;
};

export {createTask};