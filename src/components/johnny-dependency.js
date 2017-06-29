const html = require('choo/html');
const componentList = require('./component-list');
const treeGraph = require('./tree-graph');

function johnnyDependency(state, emit) {
  return html`
    <body>
      <div className="johnny-depp">
        ${componentList(state.components, state.activeComponent, emit)}
        <div className="johnny-depp__graph">
          ${treeGraph(state.components[state.activeComponent], emit)}
        </div>
      </div>
    </body>
  `;
}

module.exports = johnnyDependency;
