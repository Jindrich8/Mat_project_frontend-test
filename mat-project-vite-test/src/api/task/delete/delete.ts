import { ApiController } from '../../../types/composed/apiController';
import { apiDelete } from '../../../utils/api';
import { TaskDeleteErrorResponseDetails } from '../../dtos/errors/error_response';
import { DeleteTaskResponse } from '../../dtos/success_response';

const deleteTask = async (id:string,controller:ApiController) => {
  const response = apiDelete<
  DeleteTaskResponse,
  TaskDeleteErrorResponseDetails
  >
  (`/api/task/${id}/delete`,controller);
  return response;
};

export {deleteTask};