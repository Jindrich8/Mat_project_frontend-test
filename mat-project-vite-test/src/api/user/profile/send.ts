/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiController } from "../../../types/composed/apiController";
import { apiRequest } from "../../../utils/api";
import { UserProfileInformationErrorDetails } from "../../dtos/errors/error_response";
import { UserProfileInformationRequest } from "../../dtos/request";

const updateProfile = async(request: UserProfileInformationRequest,controller:ApiController) =>{
  const response = await apiRequest<
  undefined,
  UserProfileInformationErrorDetails
  >
  ('PUT',`/api/user/profile-information`,request,controller);
  return response;
};

export { updateProfile};