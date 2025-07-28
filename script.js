/**
 * LAW DESIGN + ROBOTS - Main JavaScript File
 * Handles responsive layout, mobile menu, and dynamic content adjustments
 */

// DOM Elements
const domElements = {
    mobileMenuToggle: null,
    menuSection: document.querySelector('.blog-menu-section'),
    container: document.querySelector('.blog-container'),
    stickyHeader: document.querySelector('.sticky-header'),
    contactCardsContainer: document.querySelector('.contact-cards-container')
};

// State management
const appState = {
    isMenuOpen: false,
    isDesktop: window.innerWidth >= 1200, // 1200px breakpoint for desktop
    scrollListeners: null
};

/**
 * Initialize mobile menu toggle button
 */
function initMobileMenu() {
    // Only create mobile menu if we're not in desktop view
    if (appState.isDesktop) return;

    // Create mobile menu button
    domElements.mobileMenuToggle = document.createElement('button');
    domElements.mobileMenuToggle.className = 'mobile-menu-toggle';
    domElements.mobileMenuToggle.innerHTML = `
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
    `;
    domElements.mobileMenuToggle.setAttribute('aria-label', 'Toggle menu');
    domElements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    
    // Add to DOM if menu section exists
    if (domElements.menuSection) {
        document.body.prepend(domElements.mobileMenuToggle);
        
        // Toggle menu on click
        domElements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking on links
        document.querySelectorAll('.blog-menu').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
}

/**
 * Toggle mobile menu state
 */
function toggleMobileMenu() {
    appState.isMenuOpen = !appState.isMenuOpen;
    
    // Update ARIA attributes and classes
    domElements.mobileMenuToggle.setAttribute('aria-expanded', appState.isMenuOpen);
    domElements.menuSection.classList.toggle('active', appState.isMenuOpen);
    domElements.mobileMenuToggle.classList.toggle('active', appState.isMenuOpen);
    
    // Toggle body scroll
    document.body.style.overflow = appState.isMenuOpen ? 'hidden' : '';
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    if (!appState.isMenuOpen) return;
    
    appState.isMenuOpen = false;
    if (domElements.mobileMenuToggle) {
        domElements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        domElements.mobileMenuToggle.classList.remove('active');
    }
    domElements.menuSection.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Initialize horizontal scrolling for desktop
 */
function initHorizontalScrolling() {
    if (!domElements.container || !appState.isDesktop) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;

    // Mouse down handler
    const handleMouseDown = (e) => {
        isDown = true;
        startX = e.pageX - domElements.container.offsetLeft;
        scrollLeft = domElements.container.scrollLeft;
        domElements.container.style.cursor = 'grabbing';
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
        isDown = false;
        domElements.container.style.cursor = 'grab';
    };

    // Mouse up handler
    const handleMouseUp = () => {
        isDown = false;
        domElements.container.style.cursor = 'grab';
    };

    // Mouse move handler
    const handleMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - domElements.container.offsetLeft;
        const walk = (x - startX) * 1.5;
        domElements.container.scrollLeft = scrollLeft - walk;
    };

    // Add event listeners
    domElements.container.addEventListener('mousedown', handleMouseDown);
    domElements.container.addEventListener('mouseleave', handleMouseLeave);
    domElements.container.addEventListener('mouseup', handleMouseUp);
    domElements.container.addEventListener('mousemove', handleMouseMove);

    // Keyboard navigation
    domElements.container.setAttribute('tabindex', '0');
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            domElements.container.scrollBy({ left: -100, behavior: 'smooth' });
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            domElements.container.scrollBy({ left: 100, behavior: 'smooth' });
            e.preventDefault();
        }
    };
    domElements.container.addEventListener('keydown', handleKeyDown);

    // Store references for cleanup
    appState.scrollListeners = {
        mouseDown: handleMouseDown,
        mouseLeave: handleMouseLeave,
        mouseUp: handleMouseUp,
        mouseMove: handleMouseMove,
        keyDown: handleKeyDown
    };
}

/**
 * Remove horizontal scrolling event listeners
 */
function cleanupHorizontalScrolling() {
    if (!domElements.container || !appState.scrollListeners) return;
    
    const { mouseDown, mouseLeave, mouseUp, mouseMove, keyDown } = appState.scrollListeners;
    
    domElements.container.removeEventListener('mousedown', mouseDown);
    domElements.container.removeEventListener('mouseleave', mouseLeave);
    domElements.container.removeEventListener('mouseup', mouseUp);
    domElements.container.removeEventListener('mousemove', mouseMove);
    domElements.container.removeEventListener('keydown', keyDown);
    
    appState.scrollListeners = null;
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const lazyLoad = (target) => {
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px 0px' // Load images slightly before they're in view
        });

        io.observe(target);
    };

    lazyImages.forEach(lazyLoad);
}

/**
 * Handle window resize events
 */
function handleResize() {
    const wasDesktop = appState.isDesktop;
    appState.isDesktop = window.innerWidth >= 1200;
    
    // Only make changes if crossing the desktop threshold
    if (wasDesktop !== appState.isDesktop) {
        if (appState.isDesktop) {
            // Switching to desktop view
            closeMobileMenu();
            initHorizontalScrolling();
            
            // Ensure menu is visible on desktop
            domElements.menuSection.style.left = '0';
            
            // Remove mobile menu toggle if it exists
            if (domElements.mobileMenuToggle) {
                domElements.mobileMenuToggle.remove();
                domElements.mobileMenuToggle = null;
            }
        } else {
            // Switching to mobile view
            cleanupHorizontalScrolling();
            initMobileMenu();
        }
    }
}

/**
 * Initialize the application
 */
function init() {
    // Initialize based on current viewport size
    if (appState.isDesktop) {
        initHorizontalScrolling();
    } else {
        initMobileMenu();
    }
    
    // Always initialize these features
    initLazyLoading();
    
    // Event listeners
    window.addEventListener('resize', debounce(handleResize, 100));
    window.addEventListener('orientationchange', () => {
        setTimeout(handleResize, 300);
    });
}

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Cleanup event listeners when the page is unloaded
window.addEventListener('beforeunload', () => {
    cleanupHorizontalScrolling();
    window.removeEventListener('resize', debounce(handleResize, 100));
    window.removeEventListener('orientationchange', () => {
        setTimeout(handleResize, 300);
    });
});
