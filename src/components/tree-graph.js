const d3 = require('d3');
const html = require('choo/html');
const merge = require('lodash/merge');
const treeNode = require('./tree-node');

function treeGraph(component, emit) {
  const margin = {top: 20, right: 120, bottom: 20, left: 120};
  const width = 960 - margin.right - margin.left;
  const height = 560 - margin.top - margin.bottom;

  const source = merge(component, {x0: height / 2, y0: 0});
  const tree = d3.tree().size([height, width]);

  const node = tree(d3.hierarchy(source));

  return html`
  <svg width="${width + margin.right + margin.left}" height="${height + margin.top + margin.bottom}">
      <g transform="translate(${margin.left}, ${margin.top})">
        ${treeNode(node)}
      </g>
    </svg>
  `;
}

module.exports = treeGraph;
