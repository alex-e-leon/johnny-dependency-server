
const css = require('sheetify');
const html = require('bel');

const prefix = css`
  :host > h1 { font-size: 12rem }
`;

css('./styles.css');

if (process.env.NODE_ENV !== 'production') {
  window.alert('not in production!');
}

const el = html`
  <section class=${prefix}>
    <h1>hello planet</h1>
  </section>
`;

document.querySelector('main').appendChild(el);
