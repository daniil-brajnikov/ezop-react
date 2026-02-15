import React, { FC, useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import styles from './style.scss';

import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/theme-github';

export interface EditorProps {
  value?: string;
  error?: string;
  isReadOnly?: boolean;
  fontSize?: number;
  onChange(value: string): void;
}

const Editor: FC<EditorProps> = ({
  onChange,
  value = '',
  error = '',
  isReadOnly = false,
  fontSize = 16
}) => {
  const [shouldShowError, setShouldShowError] = useState(false);
  const [errorMarker, setErrorMarker] = useState({
    startRow: -1,
    startCol: -1,
    endRow: -1,
    endCol: -1,
    className: styles.queryError,
    type: 'error'
  });

  useEffect(() => {
    setShouldShowError(false);
  }, [value]);

  useEffect(() => {
    if (!shouldShowError) {
      setErrorMarker({
        startCol: -1,
        startRow: -1,
        endCol: -1,
        endRow: -1,
        className: styles.queryError,
        type: 'error'
      });
    }
  }, [shouldShowError]);

  useEffect(() => {
    if (error === '') {
      setShouldShowError(false);
      return;
    }

    const valueLines = value.split('\n');
    const errorLines = error.split('\n');

    const firstErrorLine = errorLines[0];
    let startRow = -1;
    let startCol = -1;
    let endRow = -1;
    let endCol = -1;
    for (let i = 0; i < valueLines.length; i++) {
      startCol = valueLines[i].indexOf(firstErrorLine);
      if (startCol > -1) {
        startRow = i;
        endCol = valueLines[i].length;
        endRow = i;
        break;
      }
    }

    setShouldShowError(true);
    setErrorMarker({
      startCol,
      startRow,
      endCol,
      endRow,
      className: styles.queryError,
      type: 'error'
    });
  }, [error]);

  return (
    <AceEditor
      mode="text"
      theme="github"
      onChange={onChange}
      name="UNIQUE_ID_OF_DIV"
      value={value}
      fontSize={fontSize}
      editorProps={{ $blockScrolling: true }}
      highlightActiveLine={false}
      showPrintMargin={false}
      readOnly={isReadOnly}
      width="auto"
      height="auto"
      className={styles.editor}
      markers={[errorMarker]}
    />
  );
};

export default Editor;
