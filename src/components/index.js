const log = require('choo-log');
const choo = require('choo');
const css = require('sheetify');
const fixture = require('./fixture');
const johnnyDependency = require('./johnny-dependency');

css('./fonts.css');
css('./globals.css');
css('./styles.css');

const app = choo();

app.use(log());
app.use(dependencyStore);
app.route('/', johnnyDependency);
app.mount('body');

function dependencyStore(state, emitter) {
  state.count = 0;
  state.components = fixture.componentList.build().components;
  state.activeComponent = 0;

  emitter.on('addDependency', function (count) {
    state.count += count;
    emitter.emit('render');
  });

  emitter.on('changeComponent', function (component) {
    state.activeComponent = component;
    emitter.emit('render');
  });

  emitter.on('hideNode', function (node) {
    const path = [node.data.id];
    let currNode = node;

    while (currNode.parent) {
      path.push(currNode.parent.id);
      currNode = currNode.parent;
    }

    path.reverse().slice(1).forEach(nodeId => {
      if (currNode.children && currNode.children.length > 0) {
        currNode = currNode.children.filter(child => child.id === nodeId)[0];
      }
    });

    if (currNode.children) {
      currNode._children = currNode.children;
      currNode.children = null;
    } else {
      currNode.children = currNode._children;
      currNode._children = null;
    }

    emitter.emit('render');
  });
}
