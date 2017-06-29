const html = require('choo/html');
const componentList = require('./component-list');
const treeGraph = require('./tree-graph');

function johnnyDependency(state, emit) {
  const componentListProps = {
    components: '',
    onSelectComponent: changeComponent
  };

  const treeGraphProps = {
    components: ''
  };

  return html`
    <div className="johnny-depp">
      ${componentList(componentListProps)}
      <div className="johnny-depp__graph">
        ${treeGraph(treeGraphProps)}
      </div>
    </div>
  `;

  function changeComponent(component) {
    emit('changeComponent', component);
  }
}

module.exports = johnnyDependency;
