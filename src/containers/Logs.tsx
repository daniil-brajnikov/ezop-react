import { connect } from 'react-redux';
import { RootState } from '../redux/types';
import SideBox from '../components/SideBox/SideBox';

interface Props {
  className?: string;
}

const compactLogs = (value: string) => {
  const lines = value
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
  const compacted: string[] = [];

  lines.forEach(line => {
    if (compacted[compacted.length - 1] !== line) {
      compacted.push(line);
    }
  });

  return compacted.join('\n');
};

const mapState = (state: RootState, ownProps: Props) => {
  const { ontology, query } = state;
  const ontologyIsLatest =
    ontology.status !== 'idle' || query.status === 'idle';
  const title = ontologyIsLatest
    ? 'Построение онтологии'
    : 'Выполнение запроса';
  const status = ontologyIsLatest ? ontology.status : query.status;
  const value = ontologyIsLatest ? ontology.logs : query.logs;
  const statusText =
    status === 'success' ? 'Успешно' : status === 'error' ? 'Ошибка' : '';
  const logs = compactLogs(value || '');

  return {
    name: `Журнал операций${statusText ? ` — ${title}: ${statusText}` : ''}`,
    value: logs || 'Нет сообщений',
    className: ownProps.className
  };
};

export default connect(mapState)(SideBox);
