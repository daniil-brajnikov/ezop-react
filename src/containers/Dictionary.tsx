import { connect } from 'react-redux';
import { RootState } from '../redux/types';
import Dictionary from '../components/Dictionary/Dictionary';
import { Dispatch } from 'redux';
import { dictionaryFsa, setItemDescription } from '../redux/modules/dictionary';
import { queryFsa } from '../redux/modules/query';

const mapState = (state: RootState) => {
  const { dictionary, query } = state;

  return {
    items: window.serverData.templates,
    isOpen: dictionary.isOpen,
    description: dictionary.description,
    value: query.value,
  };
};

const mapDispatch = (dispatch: Dispatch) => ({
  onCollapseClick: () => {
    dispatch(dictionaryFsa.closeDictionary());
  },
  onItemClick: (name: string) => {
    dispatch(setItemDescription(name));
  },
  onApplyButtonClick: (newValue: string) => {
    dispatch(queryFsa.setValue(newValue));
  }
});

export default connect(mapState, mapDispatch)(Dictionary);
