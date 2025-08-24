const domElements = {
    mobileMenuToggle: null,
    menuSection: null,
    menuOverlay: null,
    container: document.querySelector('.blog-container'),
    stickyHeader: document.querySelector('.sticky-header'),
    blogSlider: document.querySelector('.blog-slider'),
    featuredArticles: document.querySelector('.featured-articles'),
    contactCardsContainer: document.querySelector('.contact-cards-container'),
    mainContent: document.querySelector('.main-content'),
    articleDetail: document.getElementById('article-detail'),
    blogSections: [
        document.querySelector('.sticky-header'),
        document.querySelector('.blog-slider'),
        document.querySelector('.featured-articles')
    ]
};

const appState = {
    isMenuOpen: false,
    isDesktop: window.innerWidth >= 1200,
    currentArticle: null,
    scrollPosition: 0
};

let articleTemplates = {};

async function loadArticlesFromJSON() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/vifirsanova/hse-blog/refs/heads/main/assets/content.json');
        if (!response.ok) {
            throw new Error('Failed to load articles');
        }
        articleTemplates = await response.json();
        console.log('Articles loaded successfully');
    } catch (error) {
        console.error('Error loading articles:', error);
        // Fallback to empty object if loading fails
        articleTemplates = {};
    }
}

function initMobileMenu() {
    // Only create mobile menu if we're not in desktop view
    if (appState.isDesktop) return;
    
    // Create mobile menu button if it doesn't exist
    if (!domElements.mobileMenuToggle) {
        domElements.mobileMenuToggle = document.createElement('button');
        domElements.mobileMenuToggle.className = 'mobile-menu-toggle';
        domElements.mobileMenuToggle.innerHTML = `
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        `;
        domElements.mobileMenuToggle.setAttribute('aria-label', 'Toggle menu');
        domElements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        
        document.body.appendChild(domElements.mobileMenuToggle);
        
        // Create menu overlay
        domElements.menuOverlay = document.createElement('div');
        domElements.menuOverlay.className = 'menu-overlay';
        document.body.appendChild(domElements.menuOverlay);
        
        // Create mobile menu section
        domElements.menuSection = document.createElement('nav');
        domElements.menuSection.className = 'mobile-menu-section';
        domElements.menuSection.setAttribute('aria-label', 'Мобильное меню');
        
        // Copy menu items from desktop menu
        const desktopMenu = document.querySelector('.blog-menu-section.desktop-only');
        if (desktopMenu) {
            domElements.menuSection.innerHTML = desktopMenu.innerHTML;
            
            // Add specific class for mobile menu items
            domElements.menuSection.querySelectorAll('.blog-menu').forEach(item => {
                item.classList.add('mobile-menu-item');
            });
        } else {
            // Fallback if desktop menu not found
            domElements.menuSection.innerHTML = `
                <a href="https://vifirsanova.github.io/tutorial/" class="blog-menu mobile-menu-item">Туториалы</a>
                <a href="#" class="blog-menu mobile-menu-item">Блог</a>
                <a href="#" class="blog-menu mobile-menu-item">Контакты</a>
                <a href="#" class="blog-menu subscribe mobile-menu-item">Подписаться</a>
            `;
        }
        
        document.body.appendChild(domElements.menuSection);
        
        // Toggle menu on click
        domElements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking on overlay
        domElements.menuOverlay.addEventListener('click', closeMobileMenu);
        
        // Close menu when clicking on links
        domElements.menuSection.querySelectorAll('.blog-menu').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
}

function toggleMobileMenu() {
    appState.isMenuOpen = !appState.isMenuOpen;
    domElements.mobileMenuToggle.setAttribute('aria-expanded', appState.isMenuOpen);
    domElements.menuSection.classList.toggle('active', appState.isMenuOpen);
    domElements.mobileMenuToggle.classList.toggle('active', appState.isMenuOpen);
    domElements.menuOverlay.classList.toggle('active', appState.isMenuOpen);
    document.body.style.overflow = appState.isMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    if (!appState.isMenuOpen) return;
    appState.isMenuOpen = false;
    domElements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    domElements.mobileMenuToggle.classList.remove('active');
    domElements.menuSection.classList.remove('active');
    domElements.menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function enableDesktopLayout() {
    if (!appState.isDesktop) return;
    
    // Enable vertical scrolling for each section
    domElements.blogSections.forEach(section => {
        section.style.overflowY = 'auto';
        section.style.overflowX = 'hidden';
    });
}

function disableDesktopLayout() {
    // Reset styles for mobile
    domElements.container.style.overflowX = 'hidden';
    domElements.container.style.overflowY = 'auto';
    
    domElements.blogSections.forEach(section => {
        section.style.overflowY = 'visible';
        section.style.overflowX = 'hidden';
    });
}

function showArticle(articleId) {
    if (!articleTemplates[articleId]) {
        console.error('Article not found:', articleId);
        return;
    }
    
    // Rest of the function remains the same...
    appState.currentArticle = articleId;
    
    // Save current scroll position
    appState.scrollPosition = window.scrollY || document.documentElement.scrollTop;
    
    if (appState.isDesktop) {
        // Desktop behavior - show in place
        domElements.articleDetail.style.display = 'block';
        domElements.articleDetail.innerHTML = articleTemplates[articleId];
        
        // Hide other sections
        domElements.blogSections.forEach(section => {
            section.style.display = 'none';
        });
    } else {
        // Mobile behavior - show overlay without changing scroll position
        document.body.classList.add('article-open');
        document.body.style.overflow = 'hidden';
        
        domElements.articleDetail.style.display = 'block';
        domElements.articleDetail.classList.add('visible');
        domElements.articleDetail.innerHTML = articleTemplates[articleId];
        
        // Scroll to top of article detail
        domElements.articleDetail.scrollTop = 0;
    }
    
    // Reinitialize interactive elements for the new content
    initInteractiveElements();
}

function showArticleList() {
    if (appState.isDesktop) {
        // Desktop behavior - show all sections
        domElements.blogSections.forEach(section => {
            section.style.display = 'block';
        });
        domElements.articleDetail.style.display = 'none';
    } else {
        // Mobile behavior - hide article detail
        document.body.classList.remove('article-open');
        document.body.style.overflow = '';
        
        domElements.articleDetail.classList.remove('visible');
        
        // Wait a moment before hiding to allow any transitions
        setTimeout(() => {
            domElements.articleDetail.style.display = 'none';
            
            // Restore scroll position
            if (appState.scrollPosition) {
                window.scrollTo(0, appState.scrollPosition);
            }
        }, 10);
    }
    
    appState.currentArticle = null;
}

function handleResize() {
    const wasDesktop = appState.isDesktop;
    appState.isDesktop = window.innerWidth >= 1200;
    
    if (wasDesktop !== appState.isDesktop) {
        if (appState.isDesktop) {
            // Switching to desktop view
            closeMobileMenu();
            enableDesktopLayout();
            
            if (domElements.mobileMenuToggle) {
                domElements.mobileMenuToggle.remove();
                domElements.mobileMenuToggle = null;
            }
            
            if (domElements.menuOverlay) {
                domElements.menuOverlay.remove();
                domElements.menuOverlay = null;
            }
            
            if (domElements.menuSection) {
                domElements.menuSection.remove();
                domElements.menuSection = null;
            }
            
            // Reset any hidden sections
            domElements.blogSections.forEach(section => {
                section.style.display = 'block';
            });
        } else {
            // Switching to mobile view
            disableDesktopLayout();
            initMobileMenu();
        }
        
        // Reset view state on layout change
        if (appState.currentArticle) {
            showArticle(appState.currentArticle);
        } else {
            showArticleList();
        }
    }
}

function initInteractiveElements() {
    // Handle back button in article detail
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            showArticleList();
        });
    }
    
    // Handle read more links in featured articles
    document.querySelectorAll('.read-more').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const articleId = href.substring(1);
                showArticle(articleId);
            }
        });
    });
    
    // Handle the main article read more links
    document.querySelectorAll('.blog-slider__readmore').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Extract article ID from the data attribute
            const articleId = link.getAttribute('data-article-id');
            if (articleId && articleTemplates[articleId]) {
                showArticle(articleId);
            } else {
                // Fallback to first article
                showArticle('prompt-engineering');
            }
        });
    });
    
    // Prevent any default behavior on featured articles
    document.querySelectorAll('.featured-article').forEach(article => {
        article.addEventListener('click', (e) => {
            e.preventDefault();
        });
    });
}

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

async function init() {
    // Load articles from JSON first
    await loadArticlesFromJSON();
    
    // Set initial layout mode
    if (appState.isDesktop) {
        enableDesktopLayout();
    } else {
        initMobileMenu();
    }
    
    // Initialize interactive elements
    initInteractiveElements();
}

// Initialize when DOM is ready
if (document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}
