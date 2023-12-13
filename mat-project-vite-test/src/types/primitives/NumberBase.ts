import { AtLeastOneOf } from "../base";
import { ErrorSymbol } from "../symbols";

export abstract class NumberHelper<Type extends number>{
    
    abstract to(value: number): Type;
    is(x:number):boolean {
        return this.to(x) === x;
    }

    add(x:Type,y:Type):Type {
        return x + y as Type;
    }

   abstract subs(x:Type,y:Type):Type;

   abstract addOne(x:Type):Type;
   abstract subsOne(x:Type):Type;
    
    tryTo(x:number):Type | typeof ErrorSymbol {
    const intX = this.to(x);
    return (intX === x) ? intX : ErrorSymbol;
    }
    
    toBecauseStr(because?:string) {return `${because ? `, because ${because}`:''}`;}
    
    shouldBe(x:number,paramName:string,because?:string):Type {
    const int = this.tryTo(x);
    if(int === ErrorSymbol)throw new Error(`${paramName} '${x}' should be an integer${this.toBecauseStr(because)}.`);
    return int;
    }
    
    shouldBeInInclRange(x:Type,paramName:string,range:AtLeastOneOf<{min:Type},{max:Type}>,because?:string) {
       const int = x;
       if(range.min !== undefined && int < range.min) throw new Error(`${paramName} '${x}' should be bigger or equal to ${range.min}${this.toBecauseStr(because)}.`);
        if(range.max !== undefined && int > range.max) throw new Error(`${paramName} '${x}' should be smaller or equal to ${range.max}${this.toBecauseStr(because)}.`);
        return int;
    }
    
    shouldBeInRange(x:Type,paramName:string,range:AtLeastOneOf<{min:Type},{end:Type}>,because?:string) {
        const int = x;
       if(range.min !== undefined && int < range.min) throw new Error(`${paramName} '${x}' should be bigger or equal to ${range.min}${this.toBecauseStr(because)}.`);
        if(range.end !== undefined && int >= range.end) throw new Error(`${paramName} '${x}' should be smaller than ${range.end}${this.toBecauseStr(because)}.`);
        return int;
    }
}