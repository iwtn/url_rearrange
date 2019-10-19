import resolution from './basic';
import copy from './copy';
import loadSettins from './load_settings';

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true, lastFocusedWindow: true }, function (tabs) {
    const url = new URL(tabs[0].url);
    resolution(url);
    loadSettins(url);
  });
});
