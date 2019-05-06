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

const view = () => {
  localStorage["urlSettings"] = dummyList;

  const list = localStorage["urlSettings"];
  const tag = document.querySelector('#settings');
  if (list == undefined) {
    tag.innerHTML = 'empty';
  }
}
document.addEventListener("DOMContentLoaded", () => {
  view();
});
