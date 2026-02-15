import { connect } from 'react-redux';
import { RootState } from '../redux/types';
import InputAutocompleteBox from '../components/InputAutocompleteBox/InputAutocompleteBox';
import { Dispatch } from 'redux';
import { queryFsa } from '../redux/modules/query';

const mapState = (state: RootState) => {
  const {
    query: { fontSize, value, error, status }
  } = state;

  let statusText;
  if (status === 'error') {
    statusText = 'Ошибка выполнения запроса';
  } else if (status === 'success') {
    statusText = 'Запрос выполнен успешно';
  }

  let questions: string[] = [];
  let requests: string[] = [];
  const valueString = value?.replaceAll('\n', ' ').trim();
  if (valueString) {
    const requestRegex = /.+?ответ : ".+?"/g;
    requests = Array.from(valueString.matchAll(requestRegex)).map(str => str.toString().replaceAll('\t', '').trim())
    questions = requests.map(str => {
      let question = str.toString().split('ответ :')[0].trim()
      if (question.includes('Новая команда или вопрос:')) {
        question = question.split('Новая команда или вопрос:')[1].trim()
      }
      return question
    });
  }

  return {
    name: 'Запрос',
    status,
    statusText,
    fontSize,
    value: value ? (value.includes('ответ') ? questions.join('\n\n') : value) : '',
    error
  };
};

const mapDispatch = (dispatch: Dispatch) => ({
  onChange: (value: string) => {
    dispatch(queryFsa.setValue(value));
    dispatch(queryFsa.setStatus('idle'));
  }
});

export default connect(mapState, mapDispatch)(InputAutocompleteBox);
