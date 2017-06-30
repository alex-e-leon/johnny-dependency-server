const html = require('choo/html');
const css = require('sheetify');
const componentStatus = require('./util/component-status');

const summaryLineClass = css`
  :host {
    display: inline-block;
    margin-right: 40px;
    font-weight: normal;
  }
`;

const summaryAmountClass = css`
  :host {
    font-weight: bold;
    font-size: 28px;
    position: relative;
    margin-left: 4px;
    top: 3px;
  }
`;

const summaryContainerClass = css`
  :host {
    padding: 35px;
    border-bottom: solid 1px rgba(208, 211, 217, 0.22);
  }

  :host h1 {
    font-size: 28px;
    margin-top: 2px;
  }

  :host p {
    font-size: 12px;
    text-transform: uppercase;
    opacity: 0.64;
    margin: 0;
  }
`;

const statusContainerClass = css`
  :host {
    padding: 10px 35px;
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
      <div class=${summaryContainerClass}>
        <p>Package</p>
        <h1>${component.name} @ ${component.version}</h1>
      </div>
      <div class=${statusContainerClass}>
        <p class=${summaryLineClass}>Healthy Packages <span class=${summaryAmountClass}>${latest}</span></p>
        <p class=${summaryLineClass}>Needs minor update <span class=${summaryAmountClass}>${minor + patch}</span></p>
        <p class=${summaryLineClass}>Needs major update <span class=${summaryAmountClass}>${major}</span></p>
      </div>
    </div>
  `;
}

module.exports = summary;
