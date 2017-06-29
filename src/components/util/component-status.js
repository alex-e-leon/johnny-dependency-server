function componentStatus(component) {
  let status = 'latest';
  const splitVersions = component.version.split('.');
  const splitLatestVersions = component.latestVersion.split('.');

  if (splitVersions[2] !== splitLatestVersions[2]) {
    status = 'patch-update';
  }
  if (splitVersions[1] !== splitLatestVersions[1]) {
    status = 'minor-update';
  }
  if (splitVersions[0] !== splitLatestVersions[0]) {
    status = 'major-update';
  }
  return status;
}

module.exports = componentStatus;
