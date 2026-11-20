import React, { FC, FormEvent, KeyboardEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import styles from './style.scss';
import {
  ChatMessage,
  requestChatFormalization
} from '../../redux/helpers/request';
import { ontologyFsa } from '../../redux/modules/ontology';

const ChatWidget: FC = () => {
  const dispatch: Dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async (
    event: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || sending) return;

    const nextMessages = messages.concat({ role: 'user', content });
    setMessages(nextMessages);
    setDraft('');
    setError('');
    setSending(true);

    try {
      const reply = await requestChatFormalization(nextMessages);
      setMessages(
        nextMessages.concat({
          role: 'assistant',
          content: reply,
          ontologyText: reply
        })
      );
    } catch (err) {
      setError(err.message || 'Не удалось связаться с помощником.');
    } finally {
      setSending(false);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (draft.trim() && !sending) {
        sendMessage(event);
      }
    }
  };

  return (
    <div className={styles.widget}>
      <section
        className={styles.panel}
        aria-label="Помощник по онтологиям"
        hidden={!open}
      >
        <header className={styles.header}>
          <div>
            <strong>Помощник ЭЗОП</strong>
            <span>Подсказки по шаблонам</span>
          </div>
          <button
            className={styles.close}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Свернуть чат"
          >
            −
          </button>
        </header>
        <div className={styles.messages} aria-live="polite">
          {messages.length === 0 && (
            <div className={styles.welcome}>
              Опишите задачу. Помощник составит онтологию из доступных шаблонов
              и проверит её ядром Prolog.
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={
                message.role === 'user'
                  ? styles.userMessage
                  : styles.assistantMessage
              }
            >
              {message.content}
              {message.ontologyText && window.serverData.ontology.isDraft && (
                <button
                  className={styles.apply}
                  type="button"
                  onClick={() => {
                    dispatch(
                      ontologyFsa.setValue(message.ontologyText as string)
                    );
                    dispatch(ontologyFsa.setStatus('idle'));
                    dispatch(ontologyFsa.setStatusText('Черновик'));
                    setOpen(false);
                  }}
                >
                  Перенести в онтологию
                </button>
              )}
            </div>
          ))}
          {sending && <div className={styles.typing}>Помощник отвечает…</div>}
          {error && <div className={styles.error}>{error}</div>}
        </div>
        <form className={styles.composer} onSubmit={sendMessage}>
          <textarea
            value={draft}
            onChange={event => setDraft(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Опишите задачу для онтологии…"
            aria-label="Сообщение помощнику"
            rows={2}
          />
          <button
            type="submit"
            disabled={!draft.trim() || sending}
            aria-label="Отправить сообщение"
          >
            ↑
          </button>
        </form>
      </section>
      <button
        className={styles.launcher}
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Свернуть чат' : 'Открыть чат'}
        title="Помощник по онтологиям"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-5 4v-4.2a2.5 2.5 0 0 1-2-2.3z" />
          <path d="M8 8h8M8 11.5h5" />
        </svg>
      </button>
    </div>
  );
};

export default ChatWidget;
