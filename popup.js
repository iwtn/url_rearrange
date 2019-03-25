const urlPartKinds = [
  // 'href',
  // 'host',
  { name: 'hostname',     delimiter: '',  default: true },
  { name: 'port',         delimiter: ':', default: false },
  { name: 'pathname',     delimiter: '/', default: false },
  { name: 'hash',         delimiter: '#', default: false },
  { name: 'searchParams', delimiter: '&', default: false },
  // 'password',
  // 'protocol',
  // 'search',
  // 'username'
];

const combinePars = (parts) => {
  let url = '';
  let isFirstParam = true;

  parts.forEach((elm, idx) => {
    let delimiter = elm.dataset.delimiter;
    if (elm.dataset.name == 'searchParams' && isFirstParam) {
      delimiter = '?';
      isFirstParam = false;
    }
    url += (delimiter + elm.value);
  });

  return url;
}

const changeValue = () => {
  const parts = document.querySelectorAll('input.part');
  let checkedParts = [];
  parts.forEach((elm, idx) => {
    if (elm.checked) {
      checkedParts.push(elm);
    }
  });
  const url = combinePars(checkedParts);
  copy(url);
}

const makeInputTag = (key, value, kind) => {
  const input = document.createElement('input');
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

const makePart = (key, value, kind) => {
  const part = document.createElement('div');

  part.appendChild(makeInputTag(key, value, kind));

  const txt = document.createTextNode(key + ": " + value)
  part.appendChild(txt);

  return part;
}

const setPaths = (paths, kind) => {
  const urlPaths = document.querySelector("#url-paths");
  paths.forEach((value, idx) => {
    if (idx != 0 && value != '') {
      const part = makePart(idx, value, kind);
      urlPaths.appendChild(part);
    }
  });
}

const setSearchParams = (params, kind) => {
  const urlSearchParams = document.querySelector("#url-search-params");
  for(var pair of params.entries()) {
    const part = makePart(pair[0], pair[1], kind);
    urlSearchParams.appendChild(part);
  }
}

const resolution = (urlStr) => {
  const url = new URL(urlStr);
  const urlParts = document.querySelector("#url-parts");
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
    copy(url);
  });
}

document.addEventListener("DOMContentLoaded", onInit);
