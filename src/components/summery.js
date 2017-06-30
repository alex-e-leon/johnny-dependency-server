const html = require('choo/html');
const css = require('sheetify');
const componentStatus = require('./util/component-status');

const summaryLineClass = css`
  :host {
    display: inline-block;
    margin-right: 10px;
  }
`;

const summaryContainerClass = css`
  :host {
    display: inline-block;
    margin-right: 10px;
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

function summary(comp) {
  console.log(comp);
  const component = comp || {};
  const latest = count(component, 'latest');
  const patch = count(component, 'patch-update');
  const minor = count(component, 'minor-update');
  const major = count(component, 'major-update');

  return html`
    <div>
      <p>Package</p>
      <h1>${component.name} @ ${component.version}</h1>
      <p class=${summaryLineClass}>Healthy Packages ${latest}</p>
      <p class=${summaryLineClass}>Needs minor update ${minor + patch}</p>
      <p class=${summaryLineClass}>Needs major update ${major}</p>
    </div>
  `;
}

module.exports = summary;
