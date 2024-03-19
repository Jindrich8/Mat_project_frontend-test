import { ApiController } from "../../types/composed/apiController";
import { apiRequest } from "../../utils/api";
import { ForgotPasswordErrorDetails } from "../dtos/errors/error_response";
import { ForgotPasswordRequest } from "../dtos/request";
import { ForgotPasswordResponse } from "../dtos/success_response";


const forgotPassword = async(request: ForgotPasswordRequest,controller:ApiController) =>{
  const response = await apiRequest<
  ForgotPasswordResponse,
  ForgotPasswordErrorDetails
  >
  ('POST',`/api/forgot-password`,request,controller);
  return response;
}

export { forgotPassword};