const html = require('choo/html');
const css = require('sheetify');
const dependencyStatus = require('./util/dependency-status');

const logoClass = css`
  :host {
    width: 100%;
    position: relative;
    left: -5px;
    margin: 5px 0 15px;
    opacity: 0.85;
  }
`;

const listContainer = css`
  :host {
    background-color: rgba(0, 0, 0, 0.1);
    border-right: solid 1px rgba(255, 255, 255, 0.18);
    flex: 0 1 auto;
    width: 250px;
    padding: 0 20px;
  }
`;

const textInput = css`
  :host {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    color: white;
    font-size: 15px;
    padding: 10px 8px;
    border: none;
  }

  :host::placeholder {
    color: white;
    opacity: 0.6;
  }
`;

const list = css`
  :host {
    padding: 0 0 0 4px;
  }
`;

const titleCss = css`
  :host {
    font-size: 22px;
    margin: 20px 0 10px 1px;
  }
`;

const listItem = css`
  :host {
    list-style: none;
    position: relative;
    padding-left: 20px;
    cursor: pointer;
  }

  :host.is-active {
    font-weight: bold;
  }
`;

const componentName = css`
  :host {
    display: block;
  }
`;

const componentVersion = css`
  :host {
    display: block;
    opacity: 0.6;
  }
`;

const componentStatusCss = css`
  :host {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    top: 8px;
    left: 0;
  }

  :host.is-latest {
    background-color: rgb(24, 186, 181);
    color: rgb(24, 186, 181);
  }

  :host.is-major {
    background-color: rgb(245, 79, 49);
    color: rgb(245, 79, 49);
  }

  :host.is-minor {
    background-color: rgb(254, 174, 46);
    color: rgb(254, 174, 46);
  }

  :host.is-patch {
    background-color: rgb(254, 174, 46);
    color: rgb(254, 174, 46);
  }
`;

function componentStatus(component) {
  const status = dependencyStatus(component);
  switch (status) {
    case 'latest':
      return html`<span class="${componentStatusCss} is-latest">${status}</span>`;
    case 'major-update':
      return html`<span class="${componentStatusCss} is-major">${status}</span>`;
    case 'minor-update':
      return html`<span class="${componentStatusCss} is-minor">${status}</span>`;
    case 'patch-update':
      return html`<span class="${componentStatusCss} is-patch">${status}</span>`;
    default:
      return html`<span></span>`;
  }
}

function componentList(components, activeComponent, emit) {
  const componentsItems = components.map((component, index) => {
    const className = listItem + (activeComponent === index ? ' is-active' : '');

    return html`
      <li class="${className}" onclick="${changeComponent(index)}">
        ${componentStatus(component)}
        <span class=${componentName}>${component.name}</span>
        <span class=${componentVersion}>${component.version}</span>
      </li>
    `;
  });

  return html`
    <div class=${listContainer}>
      <img class=${logoClass} src="/static/johnny-dependency.png"/>
      <form name="search" onsubmit="${handleSubmit}">
        <input class=${textInput} name="packageName" placeholder="Search for a component" />
      </form>
      <h2 class=${titleCss}>All components</h2>
      <ul class=${list}>
        ${componentsItems}
      </ul>
    </div>
  `;

  function handleSubmit(event) {
    event.preventDefault();

    emit('getComponent', event.target.elements.packageName.value);
  }

  function changeComponent(index) {
    return function () {
      emit('changeComponent', index);
    };
  }
}

module.exports = componentList;
