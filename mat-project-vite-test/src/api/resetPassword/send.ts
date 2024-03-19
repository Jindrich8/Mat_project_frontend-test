import { ApiController } from "../../types/composed/apiController";
import { apiRequest } from "../../utils/api";
import { ResetPasswordErrorDetails } from "../dtos/errors/error_response";
import { ResetPasswordRequest } from "../dtos/request";
import { ResetPasswordResponse } from "../dtos/success_response";


const resetPassword = async(request: ResetPasswordRequest,controller:ApiController) =>{
  const response = await apiRequest<
  ResetPasswordResponse,
  ResetPasswordErrorDetails
  >
  ('POST',`/api/reset-password`,request,controller);
  return response;
}

export { resetPassword};