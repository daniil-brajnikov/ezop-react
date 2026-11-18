import React, { FC } from 'react';
import classnames from 'classnames';

import styles from './style.scss';
import Header from '../Header/Header';

interface Props {
  name: string;
  value?: string;
}

interface OutputContentProps {
  value?: string;
}

export const OutputContent: FC<OutputContentProps> = ({ value }) => {
  let answers: string[] = [];
  let requests: string[] = [];
  let queries: string[] = [];
  const valueString = value?.replaceAll('\n', ' ').trim();
  if (valueString) {
    const regex = /ответ : ".+?"/g;
    const answerStrings = Array.from(valueString.matchAll(regex));
    answers = answerStrings.map(str =>
      str
        .toString()
        .split('ответ :')[1]
        .replaceAll('"', '')
        .replaceAll('\t', '')
        .trim()
    );
    const requestRegex = /.+?ответ : ".+?"/g;
    requests = Array.from(valueString.matchAll(requestRegex)).map(str =>
      str
        .toString()
        .replaceAll('\t', '')
        .trim()
    );
    queries = requests.map(entry =>
      entry
        .split('ответ :')[0]
        .replaceAll('"', '')
        .replaceAll('\t', '')
        .trim()
    );
  }

  const getProcessedAnswer = (answer: string, index: number) => {
    const requestString = requests[index];
    const isSQLRequest = requestString.toLowerCase().includes('select');
    if (isSQLRequest) {
      const request = requestString.toLowerCase().split('ответ :')[0];
      const selectRequest = request.split('select')[1];
      const selectedFields = selectRequest
        .split('from')[0]
        .replaceAll('"', '')
        .trim()
        .split(',');
      const fieldsAmount = selectedFields.length;
      const answerContent = answer
        .split(selectedFields[fieldsAmount - 1])[1]
        .split(' ');

      return (
        <table className={classnames(styles.table)} key={index}>
          <thead>
            <tr>
              {selectedFields.map((field, fieldIndex) => (
                <th key={fieldIndex}>{field}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from(Array(selectedFields.length).keys()).map(row => (
              <tr key={row}>
                {answerContent
                  .splice(0, fieldsAmount)
                  .map((field, fieldIndex) => (
                    <td key={fieldIndex}>{field}</td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return answer;
  };

  return (
    <div className={styles.value}>
      {answers.map((answer, index) => (
        <div style={{ marginBottom: '10px' }} key={index}>
          <p>
            {index + 1}. {queries[index]}
          </p>
          <p>ответ:</p>
          {getProcessedAnswer(answer, index)}
        </div>
      ))}
    </div>
  );
};

const OutputBox: FC<Props> = ({ name, value }) => (
  <div className={classnames(styles.main)}>
    <Header name={name} />
    <OutputContent value={value} />
  </div>
);

export default OutputBox;
