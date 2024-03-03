/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiController } from "../../../types/composed/apiController";
import { RequestOptions, apiGet } from "../../../utils/api";
import { UserGetProfileErrorResponseDetails } from "../../dtos/errors/error_response";
import { UserGetProfileRequest } from "../../dtos/request";
import { UserGetProfileResponse } from "../../dtos/success_response";

const getProfile = async(request: UserGetProfileRequest,controller:ApiController,options:RequestOptions|undefined = undefined) =>{
  const response = await apiGet<
  UserGetProfileRequest,
  UserGetProfileResponse,
  UserGetProfileErrorResponseDetails
  >
  (`/api/user/get_profile`,request,controller,options);
  return response;
}

export { getProfile};