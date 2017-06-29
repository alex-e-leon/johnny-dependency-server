const componentStatus = require('./component-status');

function dependencyStatus(component) {
  // Some of the worst code I think I've ever written while at Domain - alex
  let status = 'latest';
  if (!component.children || component.children.length === 0) {
    return status;
  }
  component.children.forEach(dependency => {
    let depStatus = componentStatus(dependency);
    if (
      (depStatus === 'patch-update' && (status !== 'minor-update' && status !== 'major-update')) ||
      (depStatus === 'minor-update' && status !== 'major-update') ||
      (depStatus === 'major-update')
    ) {
      status = depStatus;
    }
  });
  return status;
}

module.exports = dependencyStatus;
