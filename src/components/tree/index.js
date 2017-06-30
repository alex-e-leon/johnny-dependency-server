var microcomponent = require('microcomponent');
const html = require('choo/html');
const d3 = require('d3');
const css = require('sheetify');
const noop = require('lodash/noop');
const merge = require('lodash/merge');
const treeNode = require('./tree-node');

const margin = {top: 20, right: 120, bottom: 20, left: 120};
const width = 960 - margin.right - margin.left;
const height = 560 - margin.top - margin.bottom;

const treeClass = css`
  :host {
    flex: 1 1 auto;
  }
`;

function buildTree(component) {
  const source = merge(component, {x0: height / 2, y0: 0});
  const tree = d3.tree().size([height, width]);
  return tree(d3.hierarchy(source));
}

function createComponent() {
  const tree = microcomponent({
    name: 'tree',
    props: {
      emit: noop,
      component: null
    },
    state: {
      node: null
    }
  });

  tree.on('update', update);
  tree.on('render', render);
  tree.on('toggleNode', toggleNode);

  return tree;

  function update(props) {
    if (props.component !== this.props.component) {
      this.state.node = null;
    }

    return true;
  }

  function render() {
    if (this.state.node === null) {
      this.state.node = buildTree(this.props.component);
    }

    return html`
      <svg class=${treeClass} viewBox="0 0 ${width + margin.right + margin.left} ${height + margin.top + margin.bottom}">
        <g transform="translate(${margin.left}, ${margin.top})">
          ${this.state.node && treeNode(this.state.node, this)}
        </g>
      </svg>
    `;
  }

  function toggleNode(node) {
    if (node.children) {
      node._children = node.children;
      node.children = null;
    } else {
      node.children = node._children;
      node._children = null;
    }

    this.props.emit('render');
  }
}

module.exports = createComponent;
