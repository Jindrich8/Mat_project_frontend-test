import { JSObjectType } from "../primitives/JSObjectType";

type PrefixedRecord<TPrefix extends string, TValue> = {
    [x in `${TPrefix}${string}`]: TValue;
  };

  type Length<T extends unknown[]> = 
  T extends { length: infer L } ? L : never;
type BuildTuple<L extends number, T extends unknown[] = []> = 
  T extends { length: L } ? T : BuildTuple<L, [...T, unknown]>;
type MinusOne<N extends number> = 
  BuildTuple<N> extends [...(infer U), unknown]
    ? Length<U>
    : never;

type HasProperty<T,Prop extends PropertyKey> = T extends {[E in Prop]:unknown} ? T : never;

type InnerNester<Depth extends number,Node ,NodeNestingProp extends PropertyKey,Leaf> = Depth extends 0
? Leaf
: ((Node & { [P in NodeNestingProp]: InnerNester<MinusOne<Depth>,Node,NodeNestingProp,Leaf>[] }) | Leaf);

type Nester<Depth extends number,Node,NodeNestingProp extends PropertyKey,Leaf> = 
HasProperty<Node,NodeNestingProp> extends never ? InnerNester<Depth,Node,NodeNestingProp,Leaf> : never;

type NodeWNesting<Depth extends number,Node,NodeNestingProp extends PropertyKey,Leaf> = 
Depth extends 0 ? never :
Nester<Depth,Node,NodeNestingProp,Leaf> & Node;

type JSObjectWInterface<Interface,PropsToPick extends keyof Interface = keyof Interface> = JSObjectType & Pick<Interface,PropsToPick>;

type SetProperties<T,Properties extends Record<PropertyKey,unknown>> = Omit<T,keyof Properties> & Properties;



  export type {
    JSObjectWInterface,
    PrefixedRecord,
    MinusOne, 
    Nester,
    NodeWNesting,
    HasProperty,
    BuildTuple,
    Length,
    SetProperties
  };