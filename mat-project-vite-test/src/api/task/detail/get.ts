import { ApiController } from '../../../types/composed/apiController';
import { apiGet } from '../../../utils/api';
import { TaskDetailErrorResponseDetails } from '../../dtos/errors/error_response';
import { TaskDetailRequest } from '../../dtos/request';
import { TaskDetailResponse } from '../../dtos/success_response';

const getTaskDetail = async (id:string,controller:ApiController) => {
  const response = apiGet<
  TaskDetailRequest,
  TaskDetailResponse,
  TaskDetailErrorResponseDetails
  >
  (`/api/task/${id}/detail`,null,controller);
  return response;
};

export {getTaskDetail};