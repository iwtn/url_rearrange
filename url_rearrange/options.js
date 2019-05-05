const view = () => {
  const list = localStorage["urlSettings"];
  const tag = document.querySelector('#settings');
  if (list == undefined) {
    tag.innerHTML = 'empty';
  }
}
document.addEventListener("DOMContentLoaded", () => {
  view();
});
