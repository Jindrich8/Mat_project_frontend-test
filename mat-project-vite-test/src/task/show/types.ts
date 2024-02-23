import { TakeTaskResponse } from "../../api/dtos/success_response";

export type TakeTaskResponseDto = TakeTaskResponse;
export type TakeTaskDto = TakeTaskResponseDto['task'];
export type TakeTaskEntryDto = TakeTaskDto['entries'][0];
export type TakeTaskGroupDto = TakeTaskEntryDto & {type:'group'};
export type TakeTaskExerciseDto = TakeTaskEntryDto & {type:'exercise'};