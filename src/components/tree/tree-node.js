var microcomponent = require('microcomponent');
const html = require('choo/html');
const d3 = require('d3');
const css = require('sheetify');
const noop = require('lodash/noop');
const componentStatus = require('../util/component-status');
const dependencyStatus = require('../util/dependency-status');

const d3Link = d3.linkHorizontal()
    .x(function (d) {
      return d.y;
    })
    .y(function (d) {
      return d.x;
    });

const linkClass = css`
  :host {
    fill: none;
    stroke-width: 1.5px;
    stroke: var(--white);

    &.is-major-update {
      stroke: var(--red);
    }
    &.is-latest {
      stroke: var(--green);
    }

    &.is-minor-update,
    &.is-patch-update {
      stroke: var(--yellow);
    }
  }
`;

const nodeClass = css`
  :host {
    circle {
      fill: var(--white);
      stroke-width: 0px;
    }

    &.has-children circle {
      cursor: pointer;
      stroke-width: 8px;
      &:focus,
      &:hover {
        opacity: 0.8;
      }
    }

    &.is-major-update circle {
      fill: var(--red);
      stroke: var(--redLight);
    }
    &.is-latest circle {
      fill: var(--green);
      stroke: var(--greenLight);
    }

    &.is-minor-update circle,
    &.is-patch-update circle {
      fill: var(--yellow);
      stroke: var(--yellowLight);
    }
  }
`;

function link(node, child) {
  const source = {x: node.x, y: node.y};
  const target = {x: child.x, y: child.y};
  const linkPath = d3Link({source: source, target: target});
  const status = componentStatus(child.data);
  return html`<path d="${linkPath}" class="${linkClass} is-${status}" />`;
}

function createComponent() {
  const treeNode = microcomponent({
    name: 'tree',
    props: {
      emit: noop,
      node: {}
    }
  });

  treeNode.on('update', update);
  treeNode.on('render', render);

  function childNodes(node, emit) {
    return node.children.map(child => {
      const nextTreeNode = createComponent();

      return [
        link(node, child),
        nextTreeNode.render({node: child, emit: emit})
      ];
    });
  }

  return treeNode;

  function update(props) {
    return props.node !== this.props.node;
  }

  function render() {
    const node = this.props.node;
    const emit = this.props.emit;

    const showChildren = (node.children && node.children.length > 0);
    const hasChildren = showChildren || (node._children && node._children.length > 0);
    const status = (node.parent) ? componentStatus(node.data) : dependencyStatus(node.data);

    function hideNode() {
      emit('hideNode', node);
    }

    const nodeElement = html`
      <g
        transform="translate(${node.y} ,${node.x})"
        class="${nodeClass} is-${status} ${hasChildren ? ' has-children' : ''}"
      >
        <circle r="4.5" onclick="${hideNode}"/>
        <text x="${showChildren ? -10 : 10}" dy=".35em" textAnchor="${showChildren ? 'end' : 'start'}" fillOpacity="1">
          ${node.data.name}
        </text>
      </g>
    `;

    if (showChildren) {
      return html`
        <g>
          ${childNodes(node, emit)}
          ${nodeElement}
        </g>
      `;
    }

    return nodeElement;
  }
}

module.exports = createComponent;