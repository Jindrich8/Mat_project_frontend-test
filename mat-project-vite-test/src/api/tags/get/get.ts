import { Response } from "../../../types/composed/Response";
import { api } from "../../../utils/api";
import { ApplicationErrorResponse } from "../../dtos/errors/error_response";
import { GetAllTagsResponse } from "../../dtos/tags/all/response";

const getAllTags = async ():Promise<Response<GetAllTagsResponse,ApplicationErrorResponse>> => {
   const response = await api().get("/api/tags/all");
   if(response.status === 200) {
    return {
        success:true,
        body:response.data.data as GetAllTagsResponse
    };
   }
   else{
    return {
        status: response.status,
        statusText: response.statusText,
        success:false,
        error:response.data as ApplicationErrorResponse
    };
   }
}

export {getAllTags};