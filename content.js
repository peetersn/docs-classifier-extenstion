// content.js
// Main logic for hiding the classification banner

(async function() {
  const { log, warn, error, delay } = window.DocsClassifierUtils;

  // Main handler for classification banner - simply hide it after 3 seconds
  async function handleClassificationBanner(banner) {
    log('Classification banner detected, will hide in 3 seconds...');

    try {
      // Wait 3 seconds before hiding
      await delay(3000);

      // Add smooth transition
      banner.style.transition = 'opacity 0.5s ease-out';
      banner.style.opacity = '0';

      log('Banner fading out...');

      // Wait for fade-out to complete, then remove from layout
      await delay(500); // Match the transition duration

      banner.style.display = 'none';
      log('Banner hidden successfully');

      return true;
    } catch (e) {
      error('Error hiding banner:', e);
      return false;
    }
  }

  // Check for existing banner on page load
  async function checkExistingBanner() {
    log('Checking for existing classification banner...');

    await delay(1000); // Wait for Google Docs to fully initialize

    const banner = document.querySelector('#docs-feature-level-banner');
    if (banner) {
      log('Found existing banner on page load');
      await handleClassificationBanner(banner);
    } else {
      log('No existing banner found');
    }
  }

  // Initialize
  async function init() {
    log('Google Docs Banner Hider initialized');
    log('Version: 2.1.0');
    log('Watching for classification banners...');

    // Set up handler for observer
    window.handleClassificationBanner = handleClassificationBanner;

    // Check for banner already on page
    await checkExistingBanner();

    // Start watching for new banners
    window.DocsClassifierObserver.start();

    log('Ready to hide classification banners');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
