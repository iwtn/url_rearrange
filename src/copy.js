const copy = (urlStr) => {
  const copyTarget = document.querySelector("#copy-target");
  copyTarget.textContent = urlStr;
  copyTarget.select();
  document.execCommand('copy');
}

export default copy;
