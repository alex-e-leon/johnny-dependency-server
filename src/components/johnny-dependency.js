const html = require('choo/html');
const css = require('sheetify');
const componentList = require('./component-list');
const summary = require('./summery');
const createTree = require('./tree/index');

var tree = createTree();

const containerClass = css`
  :host {
    display: flex;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const graphClass = css`
  :host {
    fill: white;
    flex: 1 1 auto;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    flex-direction: column;
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
