import { connect } from 'react-redux';
import { RootState } from '../redux/types';
import OutputBox from '../components/OutputBox/OutputBox';

const mapState = (state: RootState) => {
    const {
        answers: { value }
    } = state;

    return {
        name: 'Ответ',
        value,
    };
};

export default connect(mapState)(OutputBox);
