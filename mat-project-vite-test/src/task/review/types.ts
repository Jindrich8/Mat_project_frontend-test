import { ReviewTaskResponse } from "../../api/dtos/success_response";

export type ReviewTaskResponseDto = ReviewTaskResponse;
export type ReviewTaskDto = ReviewTaskResponseDto['task'];
export type ReviewTaskEntryDto = ReviewTaskDto['entries'][0];
export type ReviewTaskGroupDto = ReviewTaskEntryDto & {type:'group'};
export type ReviewTaskExerciseDto = ReviewTaskEntryDto & {type:'exercise'};