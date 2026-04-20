/**
 * Container 48 Expansion Interactions
 * Version: 2025-10-27-v7
 * 
 * Handles click-based expansion for Container 48 elements across breakpoints:
 * - Large Desktop (1441px+): Expands width from 100% to 300%
 * - Standard Desktop (992-1440px): Expands width from 100% to 300%
 * - Tablet (727-991px): Expands height from 10vh to 40vh (total 90vh with 5 collapsed)
 * - Mobile (<727px): No expansion, direct navigation
 * 
 * Special handling for Hoses container:
 * - Shows overlay with Elite vs Legacy choice on second click
 * 
 * Click Behavior (all devices):
 * - First click: Expands container
 * - Second click: Navigates to page OR shows hose choice overlay
 * - Clicking another container: Collapses current, expands new one
 */

(function() {
  'use strict';
  
  // Get all container-48 elements
  const containers = document.querySelectorAll('.container-48');
  let currentExpandedContainer = null;
  
  // Function to check current breakpoint
  function isLargeDesktop() {
    return window.matchMedia('(min-width: 1441px)').matches;
  }
  
  function isStandardDesktop() {
    return window.matchMedia('(min-width: 992px) and (max-width: 1440px)').matches;
  }
  
  function isTablet() {
    return window.matchMedia('(min-width: 727px) and (max-width: 991px)').matches;
  }
  
  function isMobile() {
    return window.matchMedia('(max-width: 726px)').matches;
  }
  
  function isDesktop() {
    return isLargeDesktop() || isStandardDesktop();
  }
  
  // Function to expand container
  function expandContainer(container) {
    if (isMobile()) {
      return; // No expansion on mobile
    }
    
    if (isDesktop()) {
      // Both large and standard desktop use horizontal expansion
      container.style.width = '300%';
      container.style.height = '90vh';
      container.style.minHeight = '90vh';
    } else if (isTablet()) {
      // Tablet uses vertical expansion
      container.style.width = '100%';
      container.style.height = '40vh';
      container.style.minHeight = '40vh';
    }
    
    // Change cursor to pointer - entire expanded container is now clickable to navigate
    container.style.cursor = 'pointer';
    
    // Enable the link inside this container
    const link = container.querySelector('.hidden-link-block');
    if (link) {
      link.style.pointerEvents = 'auto';
    }
    
    currentExpandedContainer = container;
  }
  
  // Function to collapse container
  function collapseContainer(container) {
    if (isDesktop()) {
      container.style.width = '100%';
    } else if (isTablet()) {
      container.style.height = '10vh';
      container.style.minHeight = '10vh';
    }
    
    // Reset cursor to default - collapsed containers use standard cursor
    container.style.cursor = 'default';
    
    // Disable the link inside this container
    const link = container.querySelector('.hidden-link-block');
    if (link) {
      link.style.pointerEvents = 'none';
    }
    
    if (currentExpandedContainer === container) {
      currentExpandedContainer = null;
    }
  }
  
  // Collapse all containers
  function collapseAll() {
    containers.forEach(function(container) {
      collapseContainer(container);
    });
  }
  
  // Initialize: disable all links and set default cursor
  containers.forEach(function(container) {
    const link = container.querySelector('.hidden-link-block');
    if (link) {
      link.style.pointerEvents = 'none';
    }
    container.style.cursor = 'default';
  });
  
  // Set up click interactions for each container
  containers.forEach(function(container) {
    const link = container.querySelector('.hidden-link-block');
    
    container.addEventListener('click', function(e) {
      // Mobile: direct navigation, no expansion
      if (isMobile()) {
        if (link && link.href) {
          // Check if this is the hoses container with overlay
          if (link.href.includes('#Hose-Choice-Overlay')) {
            e.preventDefault();
            showHoseOverlay();
          } else {
            window.location.href = link.href;
          }
        }
        return;
      }
      
      // If this container is already expanded, navigate or show overlay
      if (currentExpandedContainer === container) {
        if (link && link.href) {
          // Check if this is the hoses container with overlay
          if (link.href.includes('#Hose-Choice-Overlay')) {
            e.preventDefault();
            showHoseOverlay();
          } else {
            window.location.href = link.href;
          }
        }
        return;
      }
      
      // First click: Prevent navigation and expand
      e.preventDefault();
      
      // Use requestAnimationFrame to ensure both transitions happen simultaneously
      requestAnimationFrame(function() {
        // Collapse any other expanded container
        if (currentExpandedContainer && currentExpandedContainer !== container) {
          collapseContainer(currentExpandedContainer);
        }
        
        // Expand this container (happens in same frame as collapse)
        expandContainer(container);
      });
    });
  });
  
  // Reset on window resize
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      collapseAll();
    }, 250);
  });
  
  // Hose overlay functions (global so they can be called from HTML)
  window.showHoseOverlay = function() {
    const overlay = document.getElementById('Hose-Choice-Overlay');
    if (overlay) {
      overlay.style.display = 'flex';
    }
  };
  
  window.closeHoseOverlay = function() {
    const overlay = document.getElementById('Hose-Choice-Overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  };
  
  // Close overlay on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.closeHoseOverlay();
    }
  });
  
})();
