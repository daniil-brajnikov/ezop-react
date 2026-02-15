import { rootReducer } from './rootReducer';
import { ExecutionStatus } from '../types';

export interface Action<Payload> {
  type: string;
  payload?: Payload;
}

export type RootState = ReturnType<typeof rootReducer>;

export interface Query {
  value: string;
  error: string;
  logs: string;
  status: ExecutionStatus;
}
/*
export interface Answer {
  value: string;
}
*/