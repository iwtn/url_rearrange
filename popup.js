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
  const parts = document.querySelectorAll('input.part');
  let checkedParts = {};
  parts.forEach((elm, idx) => {
    if (elm.checked) {
      if (checkedParts[elm.dataset.name]) {
        checkedParts[elm.dataset.name].push(elm);
      } else {
        checkedParts[elm.dataset.name] = [elm];
      }
    }
  });
  const url = combinePars(checkedParts);
  copy(url);
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

const setPaths = (paths, kind) => {
  if (paths.length == 0) {
    return;
  }
  const menu = document.querySelector('#multiParts');
  const h2 = document.createElement('h2');
  h2.textContent = 'Paths';
  menu.appendChild(h2);

  const table = document.createElement('table');
  paths.forEach((value, idx) => {
    if (idx != 0 && value != '') {
      table.appendChild(makePathTr(idx, value, kind));
    }
  });
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
        setPaths(v.split('/'), kind);
      } else {
        const part = makePart(name, v, kind);
        urlParts.appendChild(part);
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

const onInit = _ => {
  chrome.tabs.query({ active: true, currentWindow: true, lastFocusedWindow: true }, function (tabs) {
    const url = tabs[0].url;
    resolution(url);
  });
}

document.addEventListener("DOMContentLoaded", onInit);
