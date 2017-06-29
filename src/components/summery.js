const html = require('choo/html');
const css = require('sheetify');
const componentStatus = require('./util/component-status');

const containerClass = css`
  :host {
    top: 0;
    left: 0;
    position: absolute;
    display: table;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    border: solid 1px rgba(255, 255, 255, 0.18);
  }
`;

const graphClass = css`
  :host {
    fill: white;
    display: table-cell;
    width: 70%;
    vertical-align: top;
    font-size: 18px;
    font-weight: 600;
  }
`;

function count(component, status) {
  const children = component.children || [];

  return children.reduce((acc, child) => {
    if (componentStatus(child) === status) {
      acc++;
    }
    return acc + count(child, status);
  }, 0);
}

function summary(component) {
  console.log('COMPONENT', component);
  const latest = component ? count(component, 'latest') : 0;
  const patch = component ? count(component, 'patch-update') : 0;
  const minor = component ? count(component, 'minor-update') : 0;
  const major = component ? count(component, 'major-update') : 0;

  return html`
    <div>
      <p>Healthy Packages ${latest}</p>
      <p>Needs minor update ${minor + patch}</p>
      <p>Needs major update ${major}</p>
    </div>
  `;
}

module.exports = summary;
