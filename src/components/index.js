const html = require('choo/html');
const log = require('choo-log');
const choo = require('choo');

const app = choo();

app.use(log());
app.use(dependencyStore);
app.route('/', mainView);
app.mount('body');

function mainView(state, emit) {
  return html`
    <body>
      <h1>count is ${state.count}</h1>
      <h1>current component is ${state.activeComponent}</h1>
      <button onclick=${onclick}>Increment</button>
    </body>
  `;

  function onclick() {
    emit('addDependency', 1);
  }
}

function dependencyStore(state, emitter) {
  state.count = 0;
  state.activeComponent = '';

  emitter.on('addDependency', function (count) {
    state.count += count;
    emitter.emit('render');
  });

  emitter.on('changeComponent', function (component) {
    state.activeComponent = component;
    emitter.emit('render');
  });
}
