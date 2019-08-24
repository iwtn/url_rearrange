const urlPartKinds = [
  // 'href',
  // 'host',
  { name: 'protocol',     delimiter: '',   default: true },
  { name: 'hostname',     delimiter: '//', default: true },
  { name: 'port',         delimiter: ':',  default: false },
  { name: 'pathname',     delimiter: '/',  default: false },
  { name: 'hash',         delimiter: '',   default: false },
  { name: 'searchParams', delimiter: '&',  default: false },
  // 'password',
  // 'search',
  // 'username'
];

const combinePars = (parts) => {
  let url = '';
  let isFirstParam = true;

  urlPartKinds.forEach((prt, i) => {
    const part = parts[prt.name];
    if (part) {
      part.forEach((elm, idx) => {
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
      });
    }
  });

  return url;
}

const changeValue = () => {
  let checkedParts = {};
  document.querySelectorAll('input.part').forEach((elm, idx) => {
    if (elm.checked) {
      if (checkedParts[elm.dataset.name]) {
        checkedParts[elm.dataset.name].push(elm);
      } else {
        checkedParts[elm.dataset.name] = [elm];
      }
    }
  });
  copy(combinePars(checkedParts));
}

const makeInputTag = (key, value, kind) => {
  const input = document.createElement('input');
  input.setAttribute('id', kind.name + key);
  input.setAttribute('type', 'checkbox');
  input.setAttribute('class', 'part');
  input.setAttribute('name', key);
  input.setAttribute('value', value);
  input.dataset.name = kind.name;
  input.dataset.delimiter = kind.delimiter;
  if (kind.default) {
    input.setAttribute('checked', 'checked');
  }

  input.addEventListener('click', changeValue);

  return input;
}

const makeLabelTag = (key, value, kind) => {
  const label = document.createElement('label');
  label.setAttribute('for', kind.name + key);
  label.innerHTML = key + ": " + value;

  return label;
}

const makeKeyLabelTag = (key, value, kind) => {
  const label = document.createElement('label');
  label.setAttribute('for', kind.name + key);
  label.innerHTML = key;

  return label;
}

const makeValueLabelTag = (key, value, kind) => {
  const label = document.createElement('label');
  label.setAttribute('for', kind.name + key);
  label.innerHTML = value;

  return label;
}

const makePart = (key, value, kind) => {
  const part = document.createElement('div');
  part.appendChild(makeInputTag(key, value, kind));
  part.appendChild(makeLabelTag(key, value, kind));

  return part;
}

const makePathTr = (key, value, kind) => {
  const tr = document.createElement('tr');

  const checkboxTd = document.createElement('td');
  checkboxTd.appendChild(makeInputTag(key, value, kind));
  const valueTd = document.createElement('td');
  valueTd.appendChild(makeValueLabelTag(key, value, kind));

  tr.appendChild(checkboxTd);
  tr.appendChild(valueTd);

  return tr;
}

const setPaths = (pathStr, kind) => {
  if (pathStr == '/') {
    return;
  }

  const menu = document.querySelector('#multiParts');
  const h2 = document.createElement('h2');
  h2.textContent = 'Paths';
  menu.appendChild(h2);

  const table = document.createElement('table');
  pathStr.split('/').forEach((value, idx) => {
    if (idx != 0 && value != '') {
      table.appendChild(makePathTr(idx, value, kind));
    }
  });
  h2.appendChild(makeAllCheck('CheckAllPaths', table));
  menu.appendChild(table);
}

const makeTr = (key, value, kind) => {
  const tr = document.createElement('tr');

  const checkboxTd = document.createElement('td');
  checkboxTd.appendChild(makeInputTag(key, value, kind));
  const keyTd = document.createElement('td');
  keyTd.appendChild(makeKeyLabelTag(key, value, kind));
  const valueTd = document.createElement('td');
  valueTd.appendChild(makeValueLabelTag(key, value, kind));

  tr.appendChild(checkboxTd);
  tr.appendChild(keyTd);
  tr.appendChild(valueTd);

  return tr;
}

const checkAllInTable = (table) => {
  return  (eve) => {
    const boxes = table.querySelectorAll('input');
    boxes.forEach((box) => {
      box.checked = eve.target.checked;
    });
    changeValue();
  }
}

const makeAllCheck = (id, table) => {
  const span = document.createElement('span');

  const allCheckBox = document.createElement('input')
  allCheckBox.setAttribute('type', 'checkbox');
  allCheckBox.setAttribute('id', id);
  span.appendChild(allCheckBox);

  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.innerHTML = 'select all';
  span.appendChild(label);

  allCheckBox.addEventListener('click', checkAllInTable(table));

  return span;
}


const setSearchParams = (params, kind) => {
  if (Array.from(params).length == 0) {
    return;
  }
  const menu = document.querySelector('#multiParts');
  const h2 = document.createElement('h2');
  h2.textContent = 'Search Params';
  menu.appendChild(h2);

  const table = document.createElement('table');
  params.forEach((value, key) => {
    table.appendChild(makeTr(key, value, kind));
  });
  h2.appendChild(makeAllCheck('CheckAllsearchParams', table));

  menu.appendChild(table);
}

const resolution = (urlStr) => {
  const url = new URL(urlStr);
  const urlParts = document.querySelector("#singlePart");
  urlPartKinds.forEach((kind) => {
    const name = kind.name;
    const v = url[name];
    if (v) {
      if (name == 'searchParams') {
        setSearchParams(v, kind);
      } else if (name == 'pathname') {
        setPaths(v, kind);
      } else {
        urlParts.appendChild(makePart(name, v, kind));
      }
    }
  });
}

const copy = (urlStr) => {
  const copyTarget = document.querySelector("#copy-target");
  copyTarget.textContent = urlStr;
  copyTarget.select();
  document.execCommand('copy');
}

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

const saveSettings = (urlString) => {
  return () => {
    let checkedPartIds = [];
    document.querySelectorAll('input.part').forEach((elm, idx) => {
      if (elm.checked) {
        checkedPartIds.push(elm.id);
      }
    });
    saveToLocalStorage(urlString, checkedPartIds);
  }
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
  const parentDiv = document.getElementById('urls');
  parentDiv.appendChild(urlText);

  parentDiv.appendChild(makeCopyBtn(url));
}

const viewUrlSavedSettings = (urlString) => {
  const url = new URL(urlString);
  const hostname = url.hostname;

  const settingStr = localStorage.getItem(hostname);

  if (settingStr) {
    let url = '';
    let isFirstParam = true;

    const setting = JSON.parse(settingStr);
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
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true, lastFocusedWindow: true }, function (tabs) {
    const urlString = tabs[0].url;
    resolution(urlString);

    const saveBtn = document.getElementById('save');
    saveBtn.addEventListener('click', saveSettings(urlString), false);

    viewUrlSavedSettings(urlString);
  });
});
