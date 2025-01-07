import { Observable } from 'rxjs';

export interface UseCase<S, T> {
  execute(params: S): Observable<T>;  
}

export interface UseCaseMultiParam<R, S, T> {
  execute(params: R, options: S): Observable<T>;
}

export interface UseCasePromise<S, T> {
  execute(params: S): Promise<T>;
}

export interface UseCasePromiseMulti<R, S, T> {
  execute(params: R, options: S): Promise<T>;
}