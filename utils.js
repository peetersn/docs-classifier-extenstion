// utils.js
// Helper utilities for the Google Docs Data Classification Auto-Selector

const DEBUG = true; // Set to false in production

// Logging with prefix
function log(...args) {
  if (DEBUG) {
    console.log('[DocsClassifier]', ...args);
  }
}

function warn(...args) {
  console.warn('[DocsClassifier]', ...args);
}

function error(...args) {
  console.error('[DocsClassifier]', ...args);
}

// Delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Wait for element to appear (with timeout)
async function waitForElement(selectorOrFn, timeout = 5000, interval = 100) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const element = typeof selectorOrFn === 'function'
      ? selectorOrFn()
      : document.querySelector(selectorOrFn);

    if (element) {
      return element;
    }

    await delay(interval);
  }

  return null;
}

// Retry with exponential backoff
async function retry(fn, maxAttempts = 3, initialDelay = 100) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (attempt === maxAttempts) {
        throw e;
      }
      const delayTime = initialDelay * Math.pow(2, attempt - 1);
      log(`Attempt ${attempt} failed, retrying in ${delayTime}ms...`);
      await delay(delayTime);
    }
  }
}

// Check if element is visible
function isVisible(element) {
  if (!element) return false;

  const style = window.getComputedStyle(element);
  return style.display !== 'none'
    && style.visibility !== 'hidden'
    && style.opacity !== '0'
    && element.offsetParent !== null;
}

// Simulate human-like click (includes focus)
function humanClick(element) {
  if (!element) return false;

  // Focus first (important for accessibility listeners)
  element.focus();

  // Dispatch mouse events in order
  ['mousedown', 'mouseup', 'click'].forEach(eventType => {
    const event = new MouseEvent(eventType, {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.dispatchEvent(event);
  });

  return true;
}

// Export utilities to window object for use in other scripts
window.DocsClassifierUtils = {
  log,
  warn,
  error,
  delay,
  waitForElement,
  retry,
  isVisible,
  humanClick
};
