import { TypeCastCheckFunction, TypeCheckFunction } from '../helper-types';

export function createOneOf<M>(...model: Array<M | TypeCheckFunction<M>>): TypeCastCheckFunction<M> {
  return <X = M>(value: unknown): value is X => (
    model.some(
      (inList) => (typeof inList === 'function') ? (inList as TypeCheckFunction<M>)(value) : (value === inList),
    )
  );
}
