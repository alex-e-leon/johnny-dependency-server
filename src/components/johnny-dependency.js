const html = require('choo/html');
const componentList = require('./component-list');
const createTree = require('./tree/index');

var tree = createTree();

function johnnyDependency(state, emit) {
  return html`
    <body>
      <div className="johnny-depp">
        ${componentList(state.components, state.activeComponent, emit)}
        <div className="johnny-depp__graph">
          ${tree.render({component: state.components[state.activeComponent], emit: emit})}
        </div>
      </div>
    </body>
  `;
}

module.exports = johnnyDependency;
