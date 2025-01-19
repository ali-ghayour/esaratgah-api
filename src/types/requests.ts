export interface IRequest {
  phone_number?: string;
  code?: string;
}

export type RUser =  {
  _id: number;
  phone_number: string;
}
