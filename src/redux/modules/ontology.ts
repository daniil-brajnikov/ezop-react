import { createAction } from 'typesafe-actions';
import { withState } from '../helpers/typesafe-reducer';
import { changeFontSize } from '../helpers/misc';
import { Query, RootState } from '../types';
import { requestBuildOntology, requestSaveOntology } from '../helpers/request';
import { ExecutionStatus } from '../../types';

const fsa = {
  increaseFont: createAction('ONTOLOGY/INCREASE_FONT')<undefined>(),
  decreaseFont: createAction('ONTOLOGY/DECREASE_FONT')<undefined>(),
  setValue: createAction('ONTOLOGY/SET_VALUE')<string>(),
  setName: createAction('ONTOLOGY/SET_NAME')<string>(),
  setStatus: createAction('ONTOLOGY/SET_STATUS')<ExecutionStatus>(),
  setStatusText: createAction('ONTOLOGY/SET_STATUS_TEXT')<string>(),
  setOntology: createAction('ONTOLOGY/SET_ONTOLOGY')<Omit<Query, 'value'>>()
};
export const ontologyFsa = fsa;

interface State extends Query {
  fontSize: number;
  statusText: string;
  name: string;
}

const initialState: State = {
  fontSize: 16,
  value: window.serverData.ontology.text,
  error: '',
  logs: '',
  status: 'idle',
  name: window.serverData.ontology.title,
  statusText: window.serverData.ontology.isDraft ? 'Черновик' : ''
};

export const ontologyReducer = withState(initialState)
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
  .add(fsa.setName, (state, { payload }) => ({
    ...state,
    name: payload
  }))
  .add(fsa.setStatus, (state, { payload }) => ({
    ...state,
    status: payload
  }))
  .add(fsa.setStatusText, (state, { payload }) => ({
    ...state,
    statusText: payload
  }))
  .add(fsa.setOntology, (state, { payload: { error, logs, status } }) => ({
    ...state,
    error,
    logs,
    status
  }));

export const buildOntology: ThunkAction = () => async (dispatch, getState) => {
  const {
    ontology: {
      value,
      name
    }
  }: RootState = getState();

  let statusText;
  let error;
  let logs;
  let status;
  try {
    logs = (await requestBuildOntology(value, name)) ?? [];
    status = 'success';
    statusText = 'Онтология построена';
  }
  catch (err) {
    console.error(err);
    error = err.name;
    logs = err.message;
    status = 'error';
    statusText = 'Ошибка построения';
  }

  dispatch(fsa.setOntology({
    error,
    logs,
    status
  }));
  dispatch(fsa.setStatusText(statusText));
};


export const saveOntology: ThunkAction = () => async (dispatch, getState) => {
  const {
    ontology: {
      value,
      name
    }
  }: RootState = getState();
  dispatch(ontologyFsa.setStatus('idle'));
  dispatch(ontologyFsa.setStatusText('Черновик'));

  let error;
  let logs;
  let status;
  let statusText;
  try {
    logs = await requestSaveOntology(value, name, 'SaveOntology');
    status = 'success';
    statusText = 'Черновик сохранен';
  }
  catch (err) {
    console.error(err);
    error = err.name;
    logs = err.message;
    status = 'error';
    statusText = 'Ошибка сохранения';
  }
  dispatch(ontologyFsa.setStatus(status));
  dispatch(fsa.setStatusText(statusText));
  dispatch(fsa.setOntology({
    error,
    logs,
    status
  }));
};
