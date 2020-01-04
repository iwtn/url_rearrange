import copy from './copy';

const saveToLocalStorage = (url, setting) => {
  const hostname = url.hostname;

  const savedSettinsStr = localStorage.getItem(hostname);
  let savedSettings = null;

  if (savedSettinsStr) {
    savedSettings = JSON.parse(savedSettinsStr);
  } else {
    savedSettings = []
  }

  savedSettings.push(setting)
  localStorage.setItem(hostname, JSON.stringify(savedSettings));
}

const deleteFromLocalStorage = (hostname, idx) => {
  const savedSettinsStr = localStorage.getItem(hostname);
  let savedSettings = null;

  if (savedSettinsStr) {
    savedSettings = JSON.parse(savedSettinsStr);
  } else {
    savedSettings = []
  }

  savedSettings.splice(idx, 1);
  localStorage.setItem(hostname, JSON.stringify(savedSettings));
  viewUrlSavedSettings(hostname);
}

const makeCopyBtn = (url) => {
  const copyBtn = document.createElement('button');
  copyBtn.setAttribute('value', url);
  copyBtn.innerHTML= 'copy';

  copyBtn.addEventListener('click', () => {
    copy(url);
  });

  return copyBtn;
}

const makeDeleteBtn = (idx, hostname) => {
  const btn = document.createElement('button');
  btn.setAttribute('value', idx);
  btn.innerHTML= 'delete';

  btn.addEventListener('click', () => {
    deleteFromLocalStorage(hostname, idx);
  });

  return btn;
}

const makeUrlTag = (url, idx, hostname) => {
  const urlLink = document.createElement('a');
  urlLink.setAttribute('href', url);
  urlLink.setAttribute('class', 'part');
  urlLink.setAttribute('target', '_blank');
  urlLink.dataset.settingId = idx;
  urlLink.innerHTML = url;

  const linkBox = document.createElement('div');
  linkBox.appendChild(urlLink);
  linkBox.appendChild(makeCopyBtn(url));
  linkBox.appendChild(makeDeleteBtn(idx, hostname));
  const tag = document.createElement('copy-link');
  linkBox.appendChild(tag);

  const parentDiv = document.getElementById('urls');
  parentDiv.appendChild(linkBox);
}

const viewUrlSavedSetting = (setting, idx, hostname) => {
  let url = '';
  let isFirstParam = true;

  setting.forEach(function(partId) {
    const elm = document.getElementById(partId);
    if (elm) {
      let delimiter = elm.dataset.delimiter;
      let value = elm.value;
      if (elm.dataset.name == 'searchParams') {
        value = elm.name + '=' + encodeURI(elm.value);
        if (isFirstParam) {
          delimiter = '?';
          isFirstParam = false;
        }
      }
      url += (delimiter + value);
    }
  });
  makeUrlTag(url, idx, hostname);
}

const viewUrlSavedSettings = (hostname) => {
  const settingStr = localStorage.getItem(hostname);
  const settings = JSON.parse(settingStr);

  const parentDiv = document.getElementById('urls');
  parentDiv.innerHTML = '';

  if (settingStr) {
    const size = settings.length;
    for(let i = 0; i < size; i++) {
      viewUrlSavedSetting(settings[i], i, hostname);
    }
  }
}

const saveSettings = (url, hostname) => {
  return () => {
    let checkedPartIds = [];
    document.querySelectorAll('input.part').forEach((elm, idx) => {
      if (elm.checked) {
        checkedPartIds.push(elm.id);
      }
    });
    saveToLocalStorage(url, checkedPartIds);
    viewUrlSavedSettings(hostname);
  }
}

const clearDomainSetting = (hostname) => {
  const clearBtn = document.getElementById('clear');
  clearBtn.addEventListener('click', (event) => {
    window.localStorage.removeItem(hostname);
    viewUrlSavedSettings(hostname);
  }, false);
}

const loadSettins = (url) => {
    const hostname = url.hostname;
    const saveBtn = document.getElementById('save');

    saveBtn.addEventListener('click', saveSettings(url, hostname), false);
    viewUrlSavedSettings(hostname);
    clearDomainSetting(hostname);
}

export default loadSettins;
