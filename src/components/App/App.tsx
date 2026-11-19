import React, { FC } from 'react';
import QueryBox from '../../containers/QueryBox';
import styles from './style.scss';
import PageHeader from '../../containers/PageHeader';
import OntologyBox from '../../containers/OntologyBox';
import Logs from '../../containers/Logs';
import QueryToolbar from '../../containers/QueryToolbar';
import OntologyToolbar from '../../containers/OntologyToolbar';
import Dictionary from '../../containers/Dictionary';
import ChatWidget from '../ChatWidget/ChatWidget';

interface Props {
  showOntologyLogs?: boolean;
}

const App: FC<Props> = ({ showOntologyLogs }) => {
  return (
    <div className={styles.main}>
      <PageHeader />
      <ChatWidget />
      <div className={styles.layout}>
        <Dictionary className={styles.dictionary} />
        <div className={styles.blockLayout}>
          <div className={styles.block}>
            <div className={styles.block}>
              <OntologyToolbar />
              <OntologyBox />
            </div>
          </div>
          <div className={styles.block}>
            <QueryToolbar />
            <div className={styles.queryBlock}>
              <QueryBox />
            </div>
            <Logs className={styles.logs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
