import React, { FC } from 'react';
import styles from './style.scss';
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import { TriggerType } from 'webscopeio__react-textarea-autocomplete';
import '@webscopeio/react-textarea-autocomplete/style.css';

export interface EditorProps {
  value?: string;
  error?: string;
  isReadOnly?: boolean;
  fontSize?: number;
  onChange(value: string): void;
}

type Trigger = { ':': { dataProvider: (token: string) => any; component: (name: string) => Element; output: (name: string) => string; }; } & TriggerType<string | object>

const Item = ({ entity: name }: { entity: string }) => <div>{name}</div>;
const Loading = () => <div>Loading</div>;

const dictionary: string[] = window.serverData.templates

const AutocompleteEditor: FC<EditorProps> = ({
  onChange,
  value = '',
  fontSize = 16
}) => {

  return (
    <ReactTextareaAutocomplete
      className={styles.editor}
      loadingComponent={Loading}
      style={{
        fontSize: fontSize + 'px',
        lineHeight: fontSize + 5 + 'px',
        padding: 5
      }}
      value={value}
      containerStyle={{
        width: '100%',
        height: '100%',
        outline: 'none',
        borderLeft: '2px solid #6c87ff'
      }}
      onChange={(e: any) => onChange(e.target.value)}
      minChar={0}
      trigger={{
        ':': {
          dataProvider: (token: string) => {
            return token === '' ? dictionary : dictionary.filter((word: string) => word.toLowerCase().includes(token.toLowerCase()));
          },
          component: Item,
          output: (name: string) => name
        }
      } as unknown as Trigger}
    />
  );
};

export default AutocompleteEditor;
