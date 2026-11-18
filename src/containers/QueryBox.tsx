import { connect } from 'react-redux';
import { RootState } from '../redux/types';
import InputAutocompleteBox from '../components/InputAutocompleteBox/InputAutocompleteBox';
import { Dispatch } from 'redux';
import { queryFsa } from '../redux/modules/query';
import { answersFsa } from '../redux/modules/answers';

const mapState = (state: RootState) => {
  const {
    query: { fontSize, value, error, status, logs },
    answers: { value: answer }
  } = state;

  let statusText;
  if (status === 'error') {
    statusText = 'Ошибка выполнения запроса';
  } else if (status === 'success') {
    statusText = 'Запрос выполнен успешно';
  }

  let conversation = answer
    ? Array.from(answer.matchAll(/(.+?)ответ : "([\s\S]*?)"/g))
        .map((match, index) => {
          let question = match[1].replace(/\t/g, '').trim();
          const questionParts = question.split('Новая команда или вопрос:');
          question = questionParts[questionParts.length - 1].trim();
          return `${index + 1}. ${question}\nОтвет: ${match[2]
            .replace(/\t/g, '')
            .trim()}`;
        })
        .join('\n\n')
    : '';

  if (status === 'success' && logs && logs.includes('Результат:')) {
    let questions = value
      .split(/\n\s*\n/)
      .map(question => question.trim())
      .filter(Boolean);
    const logResults = logs
      .split('Команда выполнена успешно.')
      .map(result => result.trim())
      .filter(result => result.includes('Результат:'));
    if (questions.length < logResults.length) {
      questions = value
        .split(/\r?\n/)
        .map(question => question.trim())
        .filter(Boolean);
    }
    conversation = questions
      .map((question, index) => {
        const result = logResults[index] || '';
        const resultParts = result.split('Результат:');
        const answerText =
          resultParts.length > 1
            ? resultParts[resultParts.length - 1].trim()
            : '';
        return `${index + 1}. ${question}\nОтвет: ${answerText}`;
      })
      .join('\n\n');
  }

  return {
    name: 'Запрос',
    status,
    statusText,
    fontSize,
    value: status === 'success' && conversation ? conversation : value,
    isReadOnly: status === 'success' && !!conversation,
    error
  };
};

const mapDispatch = (dispatch: Dispatch) => ({
  onChange: (value: string) => {
    dispatch(queryFsa.setValue(value));
    dispatch(queryFsa.setStatus('idle'));
    dispatch(answersFsa.setValue(''));
  }
});

export default connect(mapState, mapDispatch)(InputAutocompleteBox);
