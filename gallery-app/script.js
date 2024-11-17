// Intercept navigation to enable transitions
document.addEventListener('click', async (event) => {
    const link = event.target.closest('a');
    if (!link) return;
  
    event.preventDefault();
  
    const toPath = new URL(link.href).pathname;
    const fromPath = location.pathname;
  
    // Handle navigation
    await handleNavigation({ fromPath, toPath });
  
    // Update browser history
    history.pushState({}, '', toPath);
  });
  
  // Listen for back/forward navigation events
  window.addEventListener('popstate', async () => {
    const toPath = location.pathname;
    const fromPath = null; // No need to track `fromPath` here as we're in a popstate
    await handleNavigation({ fromPath, toPath });
  });
  
  // Handle navigation between pages
  async function handleNavigation({ fromPath, toPath }) {
    const content = await fetchPageContent(toPath);
  
    let targetImg;
    if (toPath.includes('item1.html')) {
      targetImg = document.querySelector('[data-view-transition-name="item1-img"]');
    } else if (toPath.includes('item2.html')) {
      targetImg = document.querySelector('[data-view-transition-name="item2-img"]');
    }
  
    // Handle back navigation: set the viewTransitionName on the old image
    if (fromPath?.includes('item1.html') && toPath === '/demo/index.html') {
      targetImg = document.querySelector('[data-view-transition-name="item1-img"]');
      targetImg.style.viewTransitionName = 'item1-img';
    } else if (fromPath?.includes('item2.html') && toPath === '/demo/index.html') {
      targetImg = document.querySelector('[data-view-transition-name="item2-img"]');
      targetImg.style.viewTransitionName = 'item2-img';
    }
  
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        document.body.innerHTML = content;
  
        // Clear viewTransitionName after navigation
        if (targetImg) targetImg.style.viewTransitionName = '';
      });
    } else {
      // Fallback for unsupported browsers
      document.body.innerHTML = content;
    }
  }
  
  // Fetch page content dynamically
  async function fetchPageContent(url) {
    const response = await fetch(url);
    const text = await response.text();
    return /<body[^>]*>([\w\W]*)<\/body>/.exec(text)[1];
  }
  