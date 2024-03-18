declare const opaqueTag: unique symbol;



type Opaque<TBase,T> = TBase & {
    [opaqueTag]: T;
 };

type Only<T, U> = {
    [P in keyof T]: T[P];
} & {
    [P in keyof U]?: never;
};

type Either<T, U> = (Only<T, U> | Only<U, T>);

type AtLeastOneOf<T, U> = ({
    [P in keyof T]: T[P];
} & {
    [P in keyof U]?: U[P];
}) | ({
    [P in keyof U]: U[P];
} & {
    [P in keyof T]?: T[P];
});

type NoneOf<T,U> = {
    [P in keyof T]?: never;
}
& {
    [P in keyof U]?: never;
};

type EitherOrNoneOf<T,U> = (Either<T,U> | NoneOf<T,U>);

type UnionToIntersection<U> = (
    U extends never ? never : (arg: U) => never
  ) extends (arg: infer I) => void
    ? I
    : never;
  
  type UnionToTuple<T> = UnionToIntersection<
    T extends never ? never : (t: T) => T
  > extends (_: never) => infer W
    ? [...UnionToTuple<Exclude<T, W>>, W]
    : [];

    // https://github.com/microsoft/TypeScript/issues/31153#issuecomment-1942683335
    type OmitFromMappedType<Type, ToOmit> = {
        [Property in keyof Type as Exclude<Property, ToOmit>]: Type[Property];
      };


export {
    type Opaque, 
    type Either,
    type NoneOf, 
    type EitherOrNoneOf,
    type Only, 
    type AtLeastOneOf,
    type UnionToTuple,
    type OmitFromMappedType
};