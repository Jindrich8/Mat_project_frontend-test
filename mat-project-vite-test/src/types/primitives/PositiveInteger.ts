import { Opaque } from "../base";
import { NonNegativeInt } from "./NonNegativeInteger";
import { NumberHelper } from "./NumberBase";

type PositiveInt = Opaque<number,'PositiveInt'>;

class PositiveIntHelperClass extends NumberHelper<PositiveInt>{
    public MIN:PositiveInt = 1 as PositiveInt;
    public MAX:PositiveInt = Number.MAX_SAFE_INTEGER as PositiveInt;

    subs(x: PositiveInt, y: PositiveInt): PositiveInt {
        let res = 1;
        if(x > y) res = x - y;
        return res as PositiveInt;
    }
    addOne(x: PositiveInt): PositiveInt {
        return x + 1 as PositiveInt;
    }
    to(value: number): PositiveInt {
        return Math.max(Math.trunc(value),1) as PositiveInt;
    }
    fromNonNegativeInt(value:NonNegativeInt): PositiveInt {
        return Math.max(value,1) as PositiveInt;
    }
    toNonNegativeInt(value:PositiveInt): NonNegativeInt {
        return value as number as NonNegativeInt;
    }
    subsOne(x: PositiveInt): PositiveInt {
        if(x >= 2) --x;
        return x as PositiveInt;
    }
    
}

const PositiveIntHelper =  new PositiveIntHelperClass();

export {type PositiveInt, PositiveIntHelper};