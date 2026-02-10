// selectors.js
// DOM selector strategies with fallbacks for finding classification UI elements

const SELECTORS = {
  // Strategy 1: Classification banner/dialog (most reliable - ARIA-based)
  CLASSIFICATION_BANNER: [
    '[role="dialog"][aria-label*="classification"]',
    '[role="dialog"][aria-label*="Classification"]',
    '[role="alertdialog"][aria-label*="classification"]',
    '[role="dialog"][aria-label*="label"]',
    '[role="dialog"][aria-label*="Label"]',
    '[role="dialog"]' // Fallback to any dialog
  ],

  // Strategy 2: Look for "Confidential" options
  CONFIDENTIAL_OPTION: [
    '[role="menuitem"][aria-label*="Confidential"]',
    '[role="option"][aria-label*="Confidential"]',
    '[role="radio"][aria-label*="Confidential"]',
    'button[aria-label*="Confidential"]',
    '[role="menuitemradio"][aria-label*="Confidential"]',
    // Text-based fallbacks
    'div[role="menuitem"]:has-text("Confidential")',
    'div[role="option"]:has-text("Confidential")',
    'label:has-text("Confidential")',
    'span:has-text("Confidential")'
  ],

  // Strategy 3: Generic classification UI patterns
  CLASSIFICATION_CONTAINER: [
    '.docs-material-classification',
    '[data-classification]',
    '[class*="classification"]',
    'div:has(> *[class*="classification"])'
  ],

  // Strategy 4: Submit/Apply buttons
  APPLY_BUTTON: [
    'button[aria-label*="Apply"]',
    'button[aria-label*="Save"]',
    'button[aria-label*="OK"]',
    'button:has-text("Apply")',
    'button:has-text("Save")',
    'button:has-text("OK")',
    '[role="button"][aria-label*="Apply"]'
  ]
};

// Helper: Try multiple selectors until one works
function findElement(selectorsArray, root = document) {
  for (const selector of selectorsArray) {
    try {
      // Handle :has-text() pseudo-selector manually
      if (selector.includes(':has-text(')) {
        const element = findByTextContent(selector, root);
        if (element) return element;
      } else {
        const element = root.querySelector(selector);
        if (element) return element;
      }
    } catch (e) {
      // Invalid selector, continue to next
      if (window.DocsClassifierUtils && window.DocsClassifierUtils.log) {
        // Only log if utils is loaded
        console.debug('[DocsClassifier] Selector failed:', selector, e);
      }
    }
  }
  return null;
}

// Helper: Find element containing specific text
function findByTextContent(selectorWithText, root = document) {
  const match = selectorWithText.match(/^(.+?):has-text\("(.+?)"\)$/);
  if (!match) return null;

  const [, baseSelector, text] = match;
  const elements = root.querySelectorAll(baseSelector);

  for (const el of elements) {
    if (el.textContent.trim().includes(text)) {
      return el;
    }
  }
  return null;
}

// Helper: Find all elements matching selectors
function findAllElements(selectorsArray, root = document) {
  const results = [];
  for (const selector of selectorsArray) {
    try {
      if (selector.includes(':has-text(')) {
        const element = findByTextContent(selector, root);
        if (element) results.push(element);
      } else {
        const elements = root.querySelectorAll(selector);
        results.push(...elements);
      }
    } catch (e) {
      // Invalid selector, continue to next
    }
  }
  return results;
}

// Export for use in other modules
window.SELECTORS = SELECTORS;
window.findElement = findElement;
window.findByTextContent = findByTextContent;
window.findAllElements = findAllElements;
