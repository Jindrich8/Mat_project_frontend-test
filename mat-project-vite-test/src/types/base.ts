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


export {type Opaque, type Either,type NoneOf, type EitherOrNoneOf,type Only, type AtLeastOneOf};