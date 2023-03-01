import LogRocket from 'logrocket';

let _isLogRocketInitialized = false;

/**
 * Initializes LogRocket
 * If LogRocket is already initialized, it will not be initialized again
 * ref: https://remix.run/docs/en/v1/guides/constraints#lazy-initialization
 */
export function initLogRocket() {
  console.log('initLogRocket');
  console.log('window.ENV', window.ENV);
  console.log('_isLogRocketInitialized', _isLogRocketInitialized);
  // if logrocket is already initialized, don't do it again
  if (_isLogRocketInitialized) {
    return;
  }

  const { logRocketId, logRocketProjectName } = window.ENV;

  // logRocketId and project name should be set on window.env
  // if not, don't try to initialize LogRocket
  if (!logRocketId || !logRocketProjectName) {
    return;
  }

  // initialize LogRocket
  LogRocket.init(`${logRocketId}/${logRocketProjectName}`);

  // set flag to true so we don't initialize LogRocket again
  _isLogRocketInitialized = true;
}

/**
 * Returns LogRocket instance
 * If LogRocket is not initialized, it will be initialized
 */
export function getLogRocket() {
  // if logrocket is not initialized, initialize it
  if (!_isLogRocketInitialized) {
    initLogRocket();
  }

  return LogRocket;
}
