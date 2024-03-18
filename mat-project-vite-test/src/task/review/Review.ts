import { FC } from "react";
import { BasicProps } from "../../types/props/props";
import { VerticalReview, toVerticalReview } from "./Vertical/VerticalReview";
import { ReviewTaskResponse } from "../../api/dtos/success_response";
import { HorizontalReview, toHorizontalReview } from "./Horizontal/HorizontalReview";


export type Review = VerticalReview | HorizontalReview;

interface BaseReview{
    id:string;
    name:string;
    display:'vertical' | 'horizontal',
    description:string;
    points:{
        has:number;
        max:number;
    };
}

type RenderCmp<Props extends BasicProps> = FC<Props>;

const createReview = (response:ReviewTaskResponse):Review => {

    const data = response.task;
    if(data.display === 'horizontal'){
        const {display,...others} = data;
    return toHorizontalReview({display,...others},data.id)
    }
    else{ 
        const {display,...others} = data;
        return toVerticalReview({display,...others},data.id);
    }
};

const PERCENTAGE_PRECISION = 2;



export {type BaseReview, createReview as toReview,type RenderCmp,PERCENTAGE_PRECISION };




