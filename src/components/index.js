
const css = require('sheetify');
const html = require('bel');

const prefix = css`
  :host > h1 { font-size: 12rem }
`;

css('./styles.css');

const el = html`
  <section class=${prefix}>
    <h1>hello planet</h1>
  </section>
`;

document.querySelector('main').appendChild(el);
