var microcomponent = require('microcomponent');
const html = require('choo/html');
const d3 = require('d3');
const noop = require('lodash/noop');
const merge = require('lodash/merge');
const treeNode = require('./tree-node');

const margin = {top: 20, right: 120, bottom: 20, left: 120};
const width = 960 - margin.right - margin.left;
const height = 560 - margin.top - margin.bottom;

function createComponent() {
  const tree = microcomponent({
    name: 'tree',
    props: {
      component: {},
      emit: noop
    }
  });

  tree.on('update', update);
  tree.on('render', render);

  return tree;

  function update(props) {
    return props.component !== this.props.component;
  }

  function render() {
    const emit = this.props.emit;

    const source = merge(this.props.component, {x0: height / 2, y0: 0});
    const tree = d3.tree().size([height, width]);

    const node = tree(d3.hierarchy(source));

    return html`
      <svg width="${width + margin.right + margin.left}" height="${height + margin.top + margin.bottom}">
        <g transform="translate(${margin.left}, ${margin.top})">
          ${treeNode(node, emit)}
        </g>
      </svg>
    `;
  }
}

module.exports = createComponent;
