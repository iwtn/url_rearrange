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
  console.log(setting);
}

const view = () => {
  localStorage.setItem("urlSettings", JSON.stringify(dummyList));

  const list = JSON.parse(localStorage.getItem("urlSettings"));
  console.log(list);
  const tag = document.querySelector('#settings');
  if (list == undefined) {
    tag.innerHTML = 'empty';
  }

  list.forEach((setting, idx) => {
    const settingView = createView(setting);
  });


  tag.cre
}
document.addEventListener("DOMContentLoaded", () => {
  view();
});
