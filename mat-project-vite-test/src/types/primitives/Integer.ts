import { Opaque } from "../base";
import { NumberHelper } from "./NumberBase";

type Int = Opaque<number,'Int'>;

class IntHelperClass extends NumberHelper<Int>{
    public MIN = Number.MIN_SAFE_INTEGER as Int;
    public MAX = Number.MAX_SAFE_INTEGER as Int;
    subs(x: Int, y: Int): Int {
        return x - y as Int;
    }
    addOne(x: Int): Int {
        return x + 1  as Int;
    }
    subsOne(x: Int): Int {
        return x - 1 as Int;
    }
    to(value: number): Int {
        return Math.trunc(value) as Int;
    }
    parse(value:string):Int{
        return Number.parseInt(value) as Int;
    }
}

const IntHelper =  new IntHelperClass();

export {type Int, IntHelper};