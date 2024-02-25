import { ApiController } from '../../../types/composed/apiController';
import { apiGet } from '../../../utils/api';
import { CreateInfoErrorResponseDetails } from '../../dtos/errors/error_response';
import { CreateInfoRequest } from '../../dtos/request';
import { CreateInfoResponse } from '../../dtos/success_response';

const getTaskCreateInfo = async (request:CreateInfoRequest,controller:ApiController) => {
  const response = apiGet<
  CreateInfoRequest,
  CreateInfoResponse,
  CreateInfoErrorResponseDetails
  >
  ("/api/task/create_info",request,controller);
  return response;
};

export {getTaskCreateInfo};