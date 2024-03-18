import { ApiController } from '../../../types/composed/apiController';
import { apiGet } from '../../../utils/api';
import { TaskMyDetailErrorResponseDetails } from '../../dtos/errors/error_response';
import { MyTaskDetailRequest } from '../../dtos/request';
import { MyTaskDetailResponse } from '../../dtos/success_response';

const getMyTaskDetail = async (id:string,controller:ApiController) => {
  const response = apiGet<
  MyTaskDetailRequest,
  MyTaskDetailResponse,
  TaskMyDetailErrorResponseDetails
  >
  (`/api/my_task/${id}/detail`,null,controller);
  return response;
};

export {getMyTaskDetail};