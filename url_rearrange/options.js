const dummyList = [
  {
    protocol: 'https',
    hostname: 'example.com',
    port:     undefined,
    pathname: ['hoge', 'fuga'],
    hash:     undefined,
    searchParams: { 'one': 1},
  },
];

const createView = (setting) => {
  const div = document.createElement('div');
  for (const [key, value] of Object.entries(setting)) {
    const kv = document.createElement('div');
    kv.innerHTML = key + ": " + value;
    div.appendChild(kv);
  }
  return div;
}

const view = () => {
  localStorage.setItem("urlSettings", JSON.stringify(dummyList));

  const list = JSON.parse(localStorage.getItem("urlSettings"));
  const tag = document.querySelector('#settings');
  if (list == undefined) {
    tag.innerHTML = 'empty';
  }

  list.forEach((setting, idx) => {
    const settingView = createView(setting);
    tag.appendChild(settingView);
  });


  tag.cre
}
document.addEventListener("DOMContentLoaded", () => {
  view();
});
