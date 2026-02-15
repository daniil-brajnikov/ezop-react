import { combineReducers } from 'redux';
import { dictionaryReducer } from './modules/dictionary';
import { queryReducer } from './modules/query';
import { ontologyReducer } from './modules/ontology';
import { answersReducer } from './modules/answers';

export const rootReducer = combineReducers({
  dictionary: dictionaryReducer,
  query: queryReducer,
  ontology: ontologyReducer,
  answers: answersReducer
});
