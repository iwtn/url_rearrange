import copy from './copy';

const template = document.createElement('template');
const fragment = document.createDocumentFragment();

const div = document.createElement('div');
div.innerHTML = 'hoge';
fragment.appendChild(div);
template.innerHTML = '<div>hoge</div>';

template.style = `
color: red;
`;


class CopyLink extends HTMLElement {
  constructor() {
    super();
    // ShadowDOMを使った実装が入る
  }
}

export default CopyLink;
