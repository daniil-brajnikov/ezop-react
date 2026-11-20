function strip(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

export async function parseResponseWithDivider(response?: Response) {
  const resArrBuf = (await response?.arrayBuffer()) ?? new ArrayBuffer(0);
  const resArr = new Uint8Array(resArrBuf);

  const win1251decoder = new TextDecoder('windows-1251');
  const textWithHtml = win1251decoder.decode(resArr);
  const plainText = strip(textWithHtml).trim();
  const divider = '~~DIVIDER~~';
  const values = plainText.split(divider);
  return values;
}

export async function parseResponse(response?: Response) {
  const resArrBuf = (await response?.arrayBuffer()) ?? new ArrayBuffer(0);
  const resArr = new Uint8Array(resArrBuf);

  const win1251decoder = new TextDecoder('windows-1251');
  const textWithHtml = win1251decoder.decode(resArr);
  const plainText = strip(textWithHtml).trim();
  return plainText;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  ontologyText?: string;
}

class OntologyBuildError extends Error {}

function getChatMessages(messages: ChatMessage[]) {
  const cleanMessages = messages.map(({ role, content }) => ({
    role,
    content
  }));
  let latestUserIndex = -1;
  for (let i = cleanMessages.length - 1; i >= 0; i--) {
    if (cleanMessages[i].role === 'user') {
      latestUserIndex = i;
      break;
    }
  }
  if (latestUserIndex >= 0) {
    const latestUserMessage = cleanMessages[latestUserIndex];
    cleanMessages[latestUserIndex] = {
      ...latestUserMessage,
      content: `${latestUserMessage.content}\n\nВерни только формализацию на языке ЭЗОП. Не пиши Python, JavaScript, псевдокод, Markdown, заголовки, комментарии или объяснения. Каждая строка ответа должна быть предложением ЭЗОП, пригодным для проверки ядром Prolog.`
    };
  }
  const maxMessages = 12;
  if (cleanMessages.length <= maxMessages) return cleanMessages;

  const firstUserMessage = cleanMessages.find(
    message => message.role === 'user'
  );
  const recentMessages = cleanMessages.slice(-(maxMessages - 1));
  if (firstUserMessage && !recentMessages.includes(firstUserMessage)) {
    return [firstUserMessage].concat(recentMessages);
  }
  return cleanMessages.slice(-maxMessages);
}

export async function requestChatReply(messages: ChatMessage[]) {
  const endpoint = window.serverData.llmChatUrl;
  if (!endpoint) {
    throw new Error('Чат с моделью пока не подключён на сервере.');
  }
  const response = await fetch(endpoint, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: getChatMessages(messages),
      templates: window.serverData.templates,
      ['ontology_context']: window.serverData.ontology.text,
      ['env_id']: window.serverData['env_id']
    })
  });
  let result: { reply?: unknown } | null;
  try {
    result = (await response.json()) as { reply?: unknown } | null;
  } catch (err) {
    if (!response.ok) throw new Error('Сервер не смог обработать сообщение.');
    throw new Error('Сервер вернул ответ в неизвестном формате.');
  }
  if (!response.ok) {
    throw new Error(
      result && typeof result.reply === 'string'
        ? result.reply
        : 'Сервер не смог обработать сообщение.'
    );
  }
  if (!result || typeof result.reply !== 'string') {
    throw new Error('Сервер вернул ответ в неизвестном формате.');
  }
  return result.reply;
}

export async function requestRunCommand(cmd: string) {
  if (window.serverData.curcnpt_id == '') {
    throw new Error(
      'Перед выполнением запроса необходимо построить онтологию. Запрос не выполнен'
    );
  }

  if (cmd == '') {
    throw new Error('Команда должна быть непустой. Запрос не выполнен');
  }

  const formData = new FormData();
  formData.append('menu_item', 'CMD_run');
  formData.append('inset', 'CC');
  formData.append('cmd', cmd);
  formData.append('curcnpt_id', window.serverData.curcnpt_id);
  formData.append('user', window.serverData.author);

  const params = new URLSearchParams();
  for (const pair of formData) {
    params.append(pair[0], pair[1]);
  }

  const res = await fetch(`/ezop/exe/editor.exe`, {
    method: 'POST',
    body: params
  });
  const parsed = await parseResponseWithDivider(res);
  parsed[1] = parsed[1].replace(/\[\d+\]/g, '').trim();
  if (parsed[1] != '') {
    parsed[2] = parsed[2].replace(/\[\d+\]/g, '').trim();
    throw new Error(parsed[2]);
  }
  return [parsed[0], parsed[2]];
}

export async function requestDictionaryItemDescription(itemName: string) {
  const formData = new FormData();
  formData.append('menu_item', 'tmpl_left_display');
  formData.append('explorer_selected_left', itemName);
  formData.append('curcnpt_id', window.serverData.curcnpt_id);

  const params = new URLSearchParams();
  for (const pair of formData) {
    params.append(pair[0], pair[1] as string);
  }

  try {
    const res = await fetch(`/ezop/exe/editor.exe`, {
      method: 'POST',
      body: params
    });
    return parseResponse(res);
  } catch (err) {
    console.error(err);
  }
}

async function requestBuildOntologyInternal(
  text: string,
  title: string,
  saveIfNew: boolean
) {
  if (text == '' || title == '') {
    throw new Error(
      'Название и текст должны быть непустыми. Построение не выполнено.'
    );
  }
  const inset = 'CC';
  if (saveIfNew && window.serverData.curcnpt_id == '') {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await requestSaveOntology(text, title, inset);
  }

  const formData = new FormData();
  formData.append('menu_item', saveIfNew ? 'CC_build_all' : 'CC_validate_only');
  formData.append('curcnpt_text', text);
  formData.append('inset', inset);
  formData.append('curcnpt_name', title);
  formData.append('curcnpt_id', window.serverData.curcnpt_id);

  const params = new URLSearchParams();
  for (const pair of formData) {
    params.append(pair[0], pair[1]);
  }

  const res = await fetch(`/ezop/exe/editor.exe`, {
    method: 'POST',
    body: params
  });

  const parsed = await parseResponseWithDivider(res);
  console.log(parsed);
  if (parsed.length < 2) {
    throw new Error(parsed[0] || 'Сервер вернул ответ в неизвестном формате.');
  }
  if (parsed[0] != '') {
    const err = new OntologyBuildError();
    err.name = parsed[0].replace(/\[\d+\]/g, '').trim();
    err.message = parsed[1].replace(/\[\d+\]/g, '').trim();
    throw err;
  }
  return parsed[1];
}

export async function requestBuildOntology(text: string, title: string) {
  return requestBuildOntologyInternal(text, title, true);
}

export async function requestValidateOntology(text: string, title: string) {
  return requestBuildOntologyInternal(text, title, false);
}

function stripCodeFence(text: string) {
  return text
    .trim()
    .replace(/^```(?:prolog|text)?\s*\n?/, '')
    .replace(/\n?```$/, '')
    .trim();
}

export async function requestChatFormalization(messages: ChatMessage[]) {
  let conversation = messages.slice();
  let lastValidationError = '';
  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let reply: string;
    try {
      reply = stripCodeFence(await requestChatReply(conversation));
    } catch (err) {
      if (lastValidationError) {
        throw new Error(
          `${err.message}\nПоследняя ошибка проверки Prolog: ${lastValidationError}`
        );
      }
      throw err;
    }
    if (!reply) throw new Error('Помощник вернул пустую формализацию.');

    try {
      await requestValidateOntology(
        reply,
        window.serverData.ontology.title || 'Проверка формализации'
      );
      return reply;
    } catch (err) {
      if (!(err instanceof OntologyBuildError)) throw err;
      lastValidationError =
        err.message || 'Ядро Prolog отклонило формализацию.';
      const validationError = lastValidationError;
      conversation = messages.concat(
        { role: 'assistant', content: reply },
        {
          role: 'user',
          content: `Проверка ядром Prolog завершилась ошибкой:\n${validationError}\nИсправь текст онтологии и верни его целиком, без пояснений.`
        }
      );
    }
  }
  throw new Error(
    `Prolog не принял формализацию за ${maxAttempts} попыток. Последняя ошибка: ${lastValidationError}`
  );
}

async function requestSaveProlog(text: string, title: string, inset: string) {
  const formData = new FormData();
  formData.append('menu_item', 'CC_save');
  formData.append('inset', inset);
  formData.append('curcnpt_text', text);
  formData.append('curcnpt_name', title);
  formData.append('env_id', window.serverData.ontology.env_id);
  formData.append('group', window.serverData.ontology.group_id);
  formData.append('user', window.serverData.ontology.author);

  const params = new URLSearchParams();
  for (const pair of formData) {
    params.append(pair[0], pair[1]);
  }

  const res = await fetch(`/ezop/exe/editor.exe`, {
    method: 'POST',
    body: params
  });
  const parsed = await parseResponseWithDivider(res);
  if (parsed[0] != '') {
    parsed[0] = parsed[0].trim();
    throw new Error(parsed);
  }
  window.serverData['curcnpt_id'] = parsed[1].split('curcnpt_id: ')[1];
  return parsed[1];
}

async function requestSaveDrupal(text: string, title: string) {
  const formData = new FormData();
  formData.append('menu_item', 'SaveDraft');
  formData.append('curcnpt_text', text);
  formData.append('curcnpt_name', title);
  formData.append('curcnpt_id', window.serverData.curcnpt_id);
  formData.append('env_id', window.serverData.ontology.env_id);

  const params = new URLSearchParams();
  for (const pair of formData) {
    params.append(pair[0], pair[1]);
  }

  const res = await fetch(
    `../proc_data.php?group=${window.serverData.ontology.group_id}`,
    {
      method: 'POST',
      body: params
    }
  );
  const resStr = await res.text();
  return resStr
    .split('<html>')[0]
    .trim()
    .replace(/(<([^>]+)>)/gi, '');
}

export async function requestSaveOntology(
  text: string,
  title: string,
  inset: string
) {
  if (title == '') {
    throw new Error('Название должно быть непустым. Сохранение не выполнено.');
  }

  if (window.serverData.curcnpt_id == '') {
    const resProlog = await requestSaveProlog(text, title, inset);
    const resDrupal = await requestSaveDrupal(text, title);
    const result = resProlog + '\n' + resDrupal;
    return result;
  }
  return await requestSaveDrupal(text, title);
}
