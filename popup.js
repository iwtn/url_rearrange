const urlPartNames = [
  // 'href',
  // 'host',
  'hostname',
  'port',
  'pathname',
  'hash',
  'searchParams',
  // 'password',
  // 'protocol',
  // 'search',
  // 'username'
];

const changeValue = () => {
  const copyTarget = document.querySelector("#copy-target");
  const parts = document.querySelectorAll('input.part');
  let checkedParts = [];
  parts.forEach((elm, idx) => {
    if (elm.checked) {
      checkedParts.push(elm);
    }
  });
  console.log(checkedParts);
}

const makePart = (key, value) => {
  const part = document.createElement('div');

  const input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('class', 'part');
  input.setAttribute('name', key);
  input.setAttribute('value', value);

  input.addEventListener('click', changeValue);
  part.appendChild(input);

  const txt = document.createTextNode(key + ": " + value)
  part.appendChild(txt);

  return part;
}

const setPaths = (paths) => {
  const urlPaths = document.querySelector("#url-paths");
  paths.forEach((value, idx) => {
    if (idx != 0 && value != '') {
      const part = makePart(idx, value);
      urlPaths.appendChild(part);
    }
  });
}

const setSearchParams = (params) => {
  const urlSearchParams = document.querySelector("#url-search-params");
  for(var pair of params.entries()) {
    const part = makePart(pair[0], pair[1]);
    urlSearchParams.appendChild(part);
  }
}

const resolution = (urlStr) => {
  const url = new URL(urlStr);
  const urlParts = document.querySelector("#url-parts");
  urlPartNames.forEach((name) => {
    const v = url[name];
    if (v) {
      if (name == 'searchParams') {
        setSearchParams(v);
      } else if (name == 'pathname') {
        setPaths(v.split('/'));
      } else {
        const part = makePart(name, v);
        urlParts.appendChild(part);
      }
    }
  });
}

const copy = () => {
  const copyTarget = document.querySelector("#copy-target");
  copyTarget.textContent = urlStr;
  copyTarget.select();
  document.execCommand('copy');
}

const onInit = _ => {
  chrome.tabs.query({ active: true, currentWindow: true, lastFocusedWindow: true }, function (tabs) {
    resolution(tabs[0].url);
    copy();
  });
}


document.addEventListener("DOMContentLoaded", onInit);
