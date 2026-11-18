import { connect } from 'react-redux';
import { RootState } from '../redux/types';
import QueryToolbar from '../components/QueryToolbar/QueryToolbar';
import { Dispatch } from 'redux';
import { queryFsa, runQuery } from '../redux/modules/query';
import { answersFsa } from '../redux/modules/answers';

const mapState = (state: RootState) => {
  return {
    status: state.query.status
  };
};

const mapDispatch = (dispatch: Dispatch) => ({
  onRunClick: () => {
    dispatch(runQuery());
  },
  onDeleteClick: () => {
    dispatch(queryFsa.clearQuery());
  },
  onZoomInClick: () => {
    dispatch(queryFsa.increaseFont());
  },
  onZoomOutClick: () => {
    dispatch(queryFsa.decreaseFont());
  },
  onEditClick: () => {
    dispatch(queryFsa.setStatus('idle'));
    dispatch(answersFsa.setValue(''));
  }
});

export default connect(mapState, mapDispatch)(QueryToolbar);
