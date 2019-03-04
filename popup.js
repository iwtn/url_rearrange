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
  const txt = document.createTextNode(str)
  part.appendChild(txt);
  return part;
}
const onInit = _ => {
  chrome.tabs.query({ active: true, currentWindow: true, lastFocusedWindow: true }, function (tabs) {
    const urlStr = tabs[0].url;

    const url = new URL(urlStr);
    const urlParts = document.querySelector("#url-parts");
    urlPartNames.forEach((name) => {
      const v = url[name];
      if (v) {
        const part = makePart(name + ": " + v);
        urlParts.appendChild(part);
      }
    });


    let copyTarget = document.querySelector("#copy-target");
    copyTarget.textContent = urlStr;
    copyTarget.select();
    document.execCommand('copy');
  });
}


document.addEventListener("DOMContentLoaded", onInit);
