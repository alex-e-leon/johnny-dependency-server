const d3 = require('d3');
const html = require('choo/html');
// const componentStatus = require('./util/component-status');
// const dependencyStatus = require('./util/dependency-status');

// const diagonal = d3.svg.diagonal().projection(function (d) {
//   return [d.y, d.x];
// });

const line = d3.line()
    .x(function (d) {
      return d.x;
    })
    .y(function (d) {
      return d.y;
    })
    .curve(d3.curveLinear);

function link(node, child) {
  const origin = {x: node.x, y: node.y};
  const source = {x: child.x, y: child.y};
  const linkPath = line({source: origin, target: source});
  // const status = componentStatus(child);
  return html`<path d="${linkPath}" class="link is-${status}" />`;
}

function childNodes(node) {
  node.children.map(child => {
    return [
      link(node, child),
      treeNode({node: child})
    ];
  });
}

function treeNode(node) {
  const showChildren = (node.children && node.children.length > 0);
  const hasChildren = showChildren || (node._children && node._children.length > 0);
  // const status = (node.parent) ? componentStatus(node) : dependencyStatus(node);

  const nodeElement = html`
    <g
      transform="translate(${node.y} ,${node.x})"
      className="node is-${status} ${hasChildren ? ' has-children' : ''}"
    >
      <circle r="4.5" onClick="${hideNode}"/>
      <text x="${showChildren ? -10 : 10}" dy=".35em" textAnchor="${showChildren ? 'end' : 'start'}" fillOpacity={1}>
        ${node.name}
      </text>
    </g>
  `;

  if (showChildren) {
    return html`
      <g>
        ${childNodes(node)}
        ${nodeElement}
      </g>
    `;
  }

  return nodeElement;

  function hideNode(state, emit) {
    emit('hideNode', node);
  }
}

module.exports = treeNode;
