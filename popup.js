const urlPartKinds = [
  // 'href',
  // 'host',
  { name: 'hostname',     delimiter: ''  },
  { name: 'port',         delimiter: ':' },
  { name: 'pathname',     delimiter: '/' },
  { name: 'hash',         delimiter: '#' },
  { name: 'searchParams', delimiter: '&' },
  // 'password',
  // 'protocol',
  // 'search',
  // 'username'
];

const combinePars = (parts) => {
  let url = '';
  parts.forEach((elm, idx) => {
    url += (elm.dataset.delimiter + elm.value);
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

const makePart = (key, value, delimiter) => {
  const part = document.createElement('div');

  const input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('class', 'part');
  input.setAttribute('name', key);
  input.setAttribute('value', value);
  input.dataset.delimiter = delimiter;

  input.addEventListener('click', changeValue);
  part.appendChild(input);

  const txt = document.createTextNode(key + ": " + value)
  part.appendChild(txt);

  return part;
}

const setPaths = (paths, delimiter) => {
  const urlPaths = document.querySelector("#url-paths");
  paths.forEach((value, idx) => {
    if (idx != 0 && value != '') {
      const part = makePart(idx, value, delimiter);
      urlPaths.appendChild(part);
    }
  });
}

const setSearchParams = (params, delimiter) => {
  const urlSearchParams = document.querySelector("#url-search-params");
  for(var pair of params.entries()) {
    const part = makePart(pair[0], pair[1], delimiter);
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
        setSearchParams(v, kind.delimiter);
      } else if (name == 'pathname') {
        setPaths(v.split('/'), kind.delimiter);
      } else {
        const part = makePart(name, v, kind.delimiter);
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
