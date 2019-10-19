import resolution from './basic';
import copy from './copy';

const saveToLocalStorage = (urlString, setting) => {
  const url = new URL(urlString);
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

const makeCopyBtn = (url) => {
  const copyBtn = document.createElement('button');
  copyBtn.setAttribute('value', url);
  copyBtn.innerHTML= 'copy';

  copyBtn.addEventListener('click', () => {
    copy(url);
  });

  return copyBtn;
}

const makeUrlTag = (url) => {
  const urlText = document.createElement('span');
  urlText.innerHTML = url;
  urlText.setAttribute('class', 'part');

  const linkBox = document.createElement('div');
  linkBox.appendChild(urlText);
  linkBox.appendChild(makeCopyBtn(url));

  const parentDiv = document.getElementById('urls');
  parentDiv.appendChild(linkBox);
}

const viewUrlSavedSetting = (setting) => {
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
  makeUrlTag(url);
}

const viewUrlSavedSettings = (hostname) => {
  const settingStr = localStorage.getItem(hostname);
  const settings = JSON.parse(settingStr);

  const parentDiv = document.getElementById('urls');
  parentDiv.innerHTML = '';

  if (settingStr) {
    settings.forEach((setting) => {
      viewUrlSavedSetting(setting);
    });
  }
}

const saveSettings = (urlString, hostname) => {
  return () => {
    let checkedPartIds = [];
    document.querySelectorAll('input.part').forEach((elm, idx) => {
      if (elm.checked) {
        checkedPartIds.push(elm.id);
      }
    });
    saveToLocalStorage(urlString, checkedPartIds);
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

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true, lastFocusedWindow: true }, function (tabs) {
    const urlString = tabs[0].url;
    resolution(urlString);

    const url = new URL(urlString);
    const hostname = url.hostname;

    const saveBtn = document.getElementById('save');
    saveBtn.addEventListener('click', saveSettings(urlString, hostname), false);

    viewUrlSavedSettings(hostname);
    clearDomainSetting(hostname);
  });
});
