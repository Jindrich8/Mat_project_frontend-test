/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiController } from "../../../types/composed/apiController";
import { apiGet } from "../../../utils/api";
import { UserPasswordErrorResponseDetails } from "../../dtos/errors/error_response";
import { UserPasswordRequest } from "../../dtos/request";

const updatePassword = async(request: UserPasswordRequest,controller:ApiController) =>{
  const response = await apiGet<
  UserPasswordRequest,
  undefined,
  UserPasswordErrorResponseDetails
  >
  (`/api/user/password`,request,controller);
  return response;
}

export { updatePassword};