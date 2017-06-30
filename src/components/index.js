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

  emitter.on(state.events.ADDDEPENDENCY, function (count) {
    state.count += count;
    emitter.emit('render');
  });

  emitter.on(state.events.CHANGECOMPONENT, function (component) {
    state.activeComponent = component;
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
    fetch(`/api${url}`, {
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
