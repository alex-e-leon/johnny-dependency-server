const html = require('choo/html');
const css = require('sheetify');
const componentList = require('./component-list');
const summary = require('./summery');
const createTree = require('./tree/index');

var tree = createTree();

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

function johnnyDependency(state, emit) {
  const currentComponent = state.components[state.activeComponent];
  return html`
    <body>
      <div class="${containerClass}">
        ${componentList(state.components, state.activeComponent, emit)}
        <div class="${graphClass}">
          ${summary(currentComponent)}
          ${currentComponent && tree.render({component: currentComponent, emit: emit})}
        </div>
      </div>
    </body>
  `;
}

module.exports = johnnyDependency;
