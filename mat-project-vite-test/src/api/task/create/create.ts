import { Response } from '../../../types/composed/Response';
import { api } from '../../../utils/api';
import { ApplicationErrorResponse } from '../../dtos/errors/error_response';
import  {TaskCreateRequest} from '../../dtos/task/create/request'
import { TaskCreateResponse } from '../../dtos/task/create/response';

const createTask = async (request:TaskCreateRequest):Promise<Response<TaskCreateResponse,ApplicationErrorResponse>> => {
  const response = await  api().post("/api/task/create",JSON.stringify({data:request}));
  if(response.status === 200){
    return {
        success:true,
        body:  response.data.data as TaskCreateResponse
    };
  }
  else{
    return {
        success:false,
        status:response.status,
        statusText:response.statusText,
        error:response.data as ApplicationErrorResponse
    };
  }
};

export {createTask};