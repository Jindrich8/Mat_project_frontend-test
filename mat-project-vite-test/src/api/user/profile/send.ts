/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiController } from "../../../types/composed/apiController";
import { apiGet } from "../../../utils/api";
import { UserProfileInformationRequest } from "../../dtos/request";

const updateProfile = async(request: UserProfileInformationRequest,controller:ApiController) =>{
  const response = await apiGet<
  UserProfileInformationRequest,
  undefined,
  undefined
  >
  (`/api/user/profile-information`,request,controller);
  return response;
};

export { updateProfile};