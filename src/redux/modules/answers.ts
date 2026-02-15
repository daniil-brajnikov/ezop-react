import { createAction } from 'typesafe-actions';
import { withState } from '../helpers/typesafe-reducer';
import { Answer } from '../types';

const fsa = {
  setValue: createAction('ANSWERS/SET_VALUE')<string>(),
};
export const answersFsa = fsa;

const initialState: Answer = {
  value: '',
};

export const answersReducer = withState(initialState)
  .add(fsa.setValue, (state, { payload }) => ({
    ...state,
    value: payload
  }))