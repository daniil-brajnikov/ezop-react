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

export async function requestRunCommand(cmd: string) {
  if (window.serverData.curcnpt_id == '') {
    throw new Error('Перед выполнением запроса необходимо построить онтологию. Запрос не выполнен');
  }

  if (cmd == "") {
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

export async function requestBuildOntology(text: string, title: string) {
  if (text == '' || title == '') {
    throw new Error('Название и текст должны быть непустыми. Построение не выполнено.');
  }
  const inset = 'CC';
  if (window.serverData.curcnpt_id == "") {
    await requestSaveOntology(text, title, inset);
  }

  const formData = new FormData();
  formData.append('menu_item', 'CC_build_all');
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
  if (parsed[0] != '') {
    const err = new Error();
    err.name = parsed[0].replace(/\[\d+\]/g, '').trim();
    err.message = parsed[1].replace(/\[\d+\]/g, '').trim();
    throw err;
  }
  return parsed[1];
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
  window.serverData.curcnpt_id = parsed[1].split('curcnpt_id: ')[1];
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

  const res = await fetch(`../proc_data.php?group=${window.serverData.ontology.group_id}`, {
    method: 'POST',
    body: params
  });
  const resStr = await res.text();
  return resStr.split('<html>')[0].trim().replace(/(<([^>]+)>)/ig, '');
}

export async function requestSaveOntology(text: string, title: string, inset: string) {
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
