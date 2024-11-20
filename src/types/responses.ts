import {IPaginationState} from "./pagination";
export interface IResponse<T> {
  data?: T;
  payload?: {
    message?: string;
    errors?: {
      [key: string]: Array<string>;
    };
    pagination?: IPaginationState;
  };
}
