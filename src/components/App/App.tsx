import React, { FC } from 'react';
import QueryBox from '../../containers/QueryBox';
import AnswerBox from '../../containers/AnswerBox';
import styles from './style.scss';
import PageHeader from '../../containers/PageHeader';
import OntologyBox from '../../containers/OntologyBox';
import QueryLogs from '../../containers/QueryLogs';
import OntologyLogs from '../../containers/OntologyLogs';
import QueryToolbar from '../../containers/QueryToolbar';
import OntologyToolbar from '../../containers/OntologyToolbar';
import Dictionary from '../../containers/Dictionary';

interface Props {
  showOntologyLogs: boolean;
}

const App: FC<Props> = ({ showOntologyLogs }) => {
  return (
    <div className={styles.main}>
      <PageHeader />
      <div className={styles.layout}>
        <Dictionary className={styles.dictionary} />
        <div className={styles.blockLayout}>
          <div className={styles.block}>
            <div className={styles.block}>
              <OntologyToolbar />
              <OntologyBox />
            </div>
            {showOntologyLogs && <OntologyLogs className={styles.logs} />}
          </div>
          <div className={styles.block}>
            <div className={styles.block}>
              <QueryToolbar />
              <QueryBox />
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.block} style={{ width: '60%' }}>
              <AnswerBox />
            </div>
            <QueryLogs className={styles.logs} />
          </div>
        </div>
      </div>
    </div >
  );
};

export default App;
