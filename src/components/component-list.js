const html = require('choo/html');
const dependencyStatus = require('./util/dependency-status');

function componentStatus(component) {
  const status = dependencyStatus(component);
  switch (status) {
    case 'latest':
      return html`<span class="johnny-depp__component-status is-latest">${status}</span>`;
    case 'major-update':
      return html`<span class="johnny-depp__component-status is-major">${status}</span>`;
    case 'minor-update':
      return html`<span class="johnny-depp__component-status is-minor">${status}</span>`;
    case 'patch-update':
      return html`<span class="johnny-depp__component-status is-patch">${status}</span>`;
    default:
      return html`<span></span>`;
  }
}

function componentList(components, activeComponent, emit) {
  const componentsItems = components.map((component, index) => {
    const className = 'johnny-depp__list-item' + (activeComponent === index ? ' is-active' : '');

    return html`
      <li class="${className}" onclick="${changeComponent(index)}">
        ${component.name}
        ${componentStatus(component)}
      </li>
    `;
  });

  return html`
    <div class="johnny-depp__list-container">
      <img class="johnny-depp__logo" src="/static/img/jd_logo.png"/>
      <h1 class="johnny-depp__title">Components</h1>
      <ul class="johnny-depp__list">
        ${componentsItems}
      </ul>
    </div>
  `;

  function changeComponent(index) {
    return function () {
      emit('changeComponent', index);
    };
  }
}

module.exports = componentList;
