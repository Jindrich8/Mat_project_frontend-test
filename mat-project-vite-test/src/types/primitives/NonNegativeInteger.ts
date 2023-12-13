import { Opaque } from "../base";
import { Int } from "./Integer";
import { NumberHelper } from "./NumberBase";

type NonNegativeInt = Opaque<number,'NonNegativeInt'>;

class NonNegativeIntHelperClass extends NumberHelper<NonNegativeInt>{
    public MIN = 0 as NonNegativeInt;
    public MAX = Number.MAX_SAFE_INTEGER as NonNegativeInt;

    subs(x: NonNegativeInt, y: NonNegativeInt): NonNegativeInt {
        let res = 0;
        if(x >= y) res = x - y;
        return res as NonNegativeInt;
    }
    addOne(x: NonNegativeInt): NonNegativeInt {
        return x + 1 as NonNegativeInt;
    }
    to(value: number): NonNegativeInt {
        return Math.max(Math.trunc(value),0) as NonNegativeInt;
    }
    fromInt(value:Int): NonNegativeInt {
        return Math.max(value,0) as NonNegativeInt;
    }
    toInt(value:NonNegativeInt) :Int {
        return value as number as Int;
    }
    subsOne(x: NonNegativeInt): NonNegativeInt {
        if(x >= 1) --x;
        return x as NonNegativeInt;
    }
    
}

const NonNegativeIntHelper =  new NonNegativeIntHelperClass();

export {type NonNegativeInt, NonNegativeIntHelper};