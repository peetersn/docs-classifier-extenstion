// observer.js
// MutationObserver logic to detect when classification banners appear

(function() {
  const { log, warn } = window.DocsClassifierUtils;

  let observer = null;
  let processingBanner = false;

  // Callback when mutations are detected
  function onMutation(mutations) {
    // Prevent re-entrant processing
    if (processingBanner) {
      return;
    }

    // Check if any added nodes contain classification banner
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          // Skip text nodes
          if (node.nodeType !== Node.ELEMENT_NODE) {
            continue;
          }

          // Check if this node or its descendants is a classification banner
          const banner = findClassificationBanner(node);
          if (banner) {
            log('Classification banner detected!', banner);
            processingBanner = true;
            handleClassificationBanner(banner)
              .finally(() => {
                processingBanner = false;
              });
            return; // Process one at a time
          }
        }
      }
    }
  }

  // Find classification banner in node tree
  function findClassificationBanner(node) {
    // Check the node itself for the specific ID
    if (node.matches && node.id === 'docs-feature-level-banner') {
      return node;
    }

    // Check descendants for the specific ID
    const banner = node.querySelector('#docs-feature-level-banner');
    if (banner) {
      return banner;
    }

    return null;
  }

  // Start observing
  function startObserver() {
    if (observer) {
      log('Observer already running');
      return;
    }

    log('Starting MutationObserver...');

    observer = new MutationObserver(onMutation);

    // Observe entire document body for added elements
    observer.observe(document.body, {
      childList: true,      // Watch for added/removed children
      subtree: true,        // Watch entire tree
      attributes: false,    // Don't watch attribute changes (performance)
      characterData: false  // Don't watch text changes (performance)
    });

    log('MutationObserver started');
  }

  // Stop observing (for cleanup)
  function stopObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
      log('MutationObserver stopped');
    }
  }

  // Export
  window.DocsClassifierObserver = {
    start: startObserver,
    stop: stopObserver
  };

  // Handler will be defined in content.js
  window.handleClassificationBanner = null;
})();
