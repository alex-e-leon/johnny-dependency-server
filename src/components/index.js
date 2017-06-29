const log = require('choo-log');
const choo = require('choo');
const css = require('sheetify');
const johnnyDependency = require('./johnny-dependency');

css('./fonts.css');
css('./globals.css');
css('./styles.css');

const app = choo();

app.use(log());
app.use(dependencyStore);
app.route('/', johnnyDependency);
app.route('/package/*', johnnyDependency);
app.mount('body');

function dependencyStore(state, emitter) {
  state.count = 0;
  state.components = [];
  state.activeComponent = 0;

  state.events.ADDDEPENDENCY = 'addDependency';
  state.events.GETCOMPONENT = 'getComponent';
  state.events.CHANGECOMPONENT = 'changeComponent';
  state.events.HIDENODE = 'hideNode';

  emitter.on(state.events.ADDDEPENDENCY, function (count) {
    state.count += count;
    emitter.emit('render');
  });

  emitter.on(state.events.CHANGECOMPONENT, function (component) {
    state.activeComponent = component;
    emitter.emit('render');
  });

  emitter.on(state.events.HIDENODE, function (node) {
    const path = [node.id];
    let currNode = node;

    while (currNode.parent) {
      path.push(currNode.parent.id);
      currNode = currNode.parent;
    }

    currNode = state.components[state.activeComponent];

    path.reverse().slice(1).forEach(nodeId => {
      currNode = currNode.children.filter(child => child.id === nodeId)[0];
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

  emitter.on(state.events.DOMCONTENTLOADED, function () {
    if (state.route.startsWith('/package')) {
      fetchComponent(`/package/${state.params.wildcard}`);
    }
  });

  emitter.on(state.events.PUSHSTATE, function (route) {
    if (route.startsWith('/package')) {
      fetchComponent(`${route}`);
    }
  });

  emitter.on(state.events.GETCOMPONENT, function (packageName) {
    emitter.emit(state.events.PUSHSTATE, `/package/${packageName}`);
  });

  function fetchComponent(url) {
    fetch(url, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(res => {
      state.components = [res];
      state.activeComponent = 0;
      emitter.emit('render');
    });
  }
}
