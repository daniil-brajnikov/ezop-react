import { createAction } from 'typesafe-actions';
import { withState } from '../helpers/typesafe-reducer';
import { changeFontSize } from '../helpers/misc';
import { ThunkAction } from 'redux-thunk';
import { RootState, Query } from '../types';
import { requestRunCommand } from '../helpers/request';
import { ExecutionStatus } from '../../types';
import { answersFsa } from './answers';

const fsa = {
  increaseFont: createAction('QUERY/INCREASE_FONT')<undefined>(),
  decreaseFont: createAction('QUERY/DECREASE_FONT')<undefined>(),
  setValue: createAction('QUERY/SET_VALUE')<string>(),
  setStatus: createAction('QUERY/SET_STATUS')<ExecutionStatus>(),
  setQuery: createAction('QUERY/SET_QUERY')<Query>(),
  clearQuery: createAction('QUERY/CLEAR_QUERY')<undefined>()
};
export const queryFsa = fsa;

interface State extends Query {
  fontSize: number;
}

const initialState: State = {
  fontSize: 16,
  value: '',
  error: '',
  logs: '',
  status: 'idle'
};

export const queryReducer = withState(initialState)
  .add(fsa.increaseFont, state => ({
    ...state,
    fontSize: changeFontSize(state.fontSize, 2)
  }))
  .add(fsa.decreaseFont, state => ({
    ...state,
    fontSize: changeFontSize(state.fontSize, -2)
  }))
  .add(fsa.setValue, (state, { payload }) => ({
    ...state,
    value: payload
  }))
  .add(fsa.setStatus, (state, { payload }) => ({
    ...state,
    status: payload
  }))
  .add(fsa.setQuery, (state, { payload: { value, error, logs, status } }) => ({
    ...state,
    value: error ? state.value : value,
    error,
    logs,
    status
  }))
  .add(fsa.clearQuery, state => ({
    ...state,
    value: '',
    error: '',
    logs: '',
    status: 'idle'
  }));

export const runQuery: ThunkAction = () => async (dispatch, getState) => {
  const {
    query
  }: RootState = getState();

  let error;
  let logs;
  let status;
  let answer;
  try {
    [answer, logs] = (await requestRunCommand(query.value)) ?? [];
    status = 'success';
  }
  catch (err) {
    console.error(err);
    error = err.name;
    logs = err.message;
    status = 'error';
  }

  dispatch(queryFsa.setQuery({
    value: answer,
    error,
    logs,
    status
  }));
  dispatch(answersFsa.setValue(answer));
};
