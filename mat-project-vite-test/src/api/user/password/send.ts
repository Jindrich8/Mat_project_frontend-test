import { ApiController } from "../../../types/composed/apiController";
import { apiRequest } from "../../../utils/api";
import { UserPasswordErrorResponseDetails } from "../../dtos/errors/error_response";
import { UserPasswordRequest } from "../../dtos/request";

const updatePassword = async(request: UserPasswordRequest,controller:ApiController) =>{
  const response = await apiRequest<
  undefined,
  UserPasswordErrorResponseDetails
  >
  ('PUT',`/api/user/password`,request,controller);
  return response;
}

export { updatePassword};