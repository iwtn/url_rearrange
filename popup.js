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

const makePart = (str) => {
  const part = document.createElement('div');
  const input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  const txt = document.createTextNode(str)
  part.appendChild(input);
  part.appendChild(txt);
  return part;
}

const setPaths = (paths) => {
  const urlPaths = document.querySelector("#url-paths");
  paths.forEach((value, idx) => {
    if (idx != 0 && value != '') {
      const part = makePart(idx + ": " + value);
      urlPaths.appendChild(part);
    }
  });
}

const setSearchParams = (params) => {
  const urlSearchParams = document.querySelector("#url-search-params");
  for(var pair of params.entries()) {
    const part = makePart(pair[0] + ": " + pair[1]);
    urlSearchParams.appendChild(part);
  }
}

const onInit = _ => {
  chrome.tabs.query({ active: true, currentWindow: true, lastFocusedWindow: true }, function (tabs) {
    const urlStr = tabs[0].url;

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
          const part = makePart(name + ": " + v);
          urlParts.appendChild(part);
        }
      }
    });


    let copyTarget = document.querySelector("#copy-target");
    copyTarget.textContent = urlStr;
    copyTarget.select();
    document.execCommand('copy');
  });
}


document.addEventListener("DOMContentLoaded", onInit);
