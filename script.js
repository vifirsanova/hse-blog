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

let siteContent = {};

async function loadContentFromJSON() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/vifirsanova/hse-blog/refs/heads/main/assets/preview.json');
        if (!response.ok) {
            throw new Error('Failed to load content');
        }
        siteContent = await response.json();
        console.log('Content loaded successfully');
        
        // Render the content after loading
        renderExpertOpinions();
        renderBlogSlider();
        renderFeaturedArticles();
    } catch (error) {
        console.error('Error loading content:', error);
        // Fallback to empty object if loading fails
        siteContent = {};
    }
}

function renderExpertOpinions() {
    if (!siteContent.expertOpinions || !domElements.stickyHeader) return;
    
    const opinionsSection = domElements.stickyHeader.querySelector('.expert-opinions');
    if (!opinionsSection) return;
    
    const { heading, subheading, opinions } = siteContent.expertOpinions;
    
    // Update section header
    const sectionHeader = opinionsSection.querySelector('.section-header');
    if (sectionHeader) {
        const headingElement = sectionHeader.querySelector('h2');
        const subheadingElement = sectionHeader.querySelector('p');
        
        if (headingElement) headingElement.textContent = heading;
        if (subheadingElement) subheadingElement.textContent = subheading;
    }
    
    // Render opinion cards
    const opinionsGrid = opinionsSection.querySelector('.opinions-grid');
    if (opinionsGrid) {
        opinionsGrid.innerHTML = ''; // Clear existing content
        
        opinions.forEach(opinion => {
            const opinionCard = document.createElement('article');
            opinionCard.className = 'opinion-card';
            opinionCard.innerHTML = `
                <div class="opinion-card__img">
                    <img src="${opinion.image}" alt="${opinion.alt}" width="60" height="60" loading="lazy">
                </div>
                <div class="opinion-card__content">
                    <h3>${opinion.name}</h3>
                    <p class="affiliation">${opinion.affiliation}</p>
                    <blockquote>${opinion.quote}</blockquote>
                </div>
            `;
            opinionsGrid.appendChild(opinionCard);
        });
    }
}

function renderBlogSlider() {
    if (!siteContent.blogSlider || !domElements.blogSlider) return;
    
    const sliderWrp = domElements.blogSlider.querySelector('.blog-slider__wrp');
    if (!sliderWrp) return;
    
    sliderWrp.innerHTML = ''; // Clear existing content
    
    siteContent.blogSlider.forEach(article => {
        const articleElement = document.createElement('article');
        articleElement.className = 'blog-slider__item';
        articleElement.setAttribute('data-article-id', article.id);
        
        articleElement.innerHTML = `
            <div class="blog-slider__img">
                <img src="${article.image}" alt="${article.alt}" width="800" height="400" loading="lazy">
            </div>
            <div class="blog-slider__content">
                <time class="blog-slider__date" datetime="${article.date}">${formatDate(article.date)}</time>
                <h2 class="blog-slider__title">${article.title}</h2>
                <div class="blog-detail">
                    <span>${article.author}</span>
                    <span>${article.readTime}</span>
                </div>
                <div class="blog-slider__text">
                    <p>${article.excerpt}</p>
                </div>
                <a href="#${article.id}" class="blog-slider__readmore" aria-label="Читать статью '${article.title.replace(/<[^>]*>/g, '')}'" data-article-id="${article.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-corner-down-right" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M15 10l5 5-5 5" />
                        <path d="M4 4v7a4 4 0 004 4h12" />
                    </svg>
                    Читать далее
                </a>
            </div>
        `;
        
        sliderWrp.appendChild(articleElement);
    });
}

function renderFeaturedArticles() {
    if (!siteContent.featuredArticles || !domElements.featuredArticles) return;
    
    const { marquee, heading, articles, circle } = siteContent.featuredArticles;
    
    // Update marquee
    const marqueeContainer = domElements.featuredArticles.querySelector('.marquee-container');
    if (marqueeContainer) {
        const marqueeElement = marqueeContainer.querySelector('.marquee');
        if (marqueeElement) {
            let marqueeHTML = '';
            // Add items twice for seamless looping
            [...marquee, ...marquee].forEach(text => {
                marqueeHTML += `<span>${text}</span>`;
            });
            marqueeElement.innerHTML = marqueeHTML;
        }
    }
    
    // Update heading
    const featuredTitle = domElements.featuredArticles.querySelector('.featured-title');
    if (featuredTitle) {
        featuredTitle.textContent = heading;
    }
    
    // Render articles
    const articlesContainer = domElements.featuredArticles;
    // Find where to insert articles (after featured-title-container)
    const titleContainer = articlesContainer.querySelector('.featured-title-container');
    const existingArticles = articlesContainer.querySelectorAll('.featured-article');
    
    // Remove existing articles
    existingArticles.forEach(article => article.remove());
    
    // Add new articles
    articles.forEach(article => {
        const articleElement = document.createElement('article');
        articleElement.className = 'featured-article';
        articleElement.innerHTML = `
            <div class="article-number" aria-hidden="true">${article.number}</div>
            <div class="article-content">
                <h3 class="article-title">${article.title}</h3>
                <p class="article-subtitle">${article.subtitle} <a href="${article.link}" class="read-more">Узнать больше..</a></p>
            </div>
        `;
        
        // Insert after title container
        titleContainer.parentNode.insertBefore(articleElement, titleContainer.nextSibling);
    });
    
    // Update circle element
    const circleElement = domElements.featuredArticles.querySelector('.circle');
    if (circleElement) {
        const circleTitle = circleElement.querySelector('.circle-title');
        const circleSubtitle = circleElement.querySelector('.circle-subtitle');
        const circleFooter = circleElement.querySelector('.circle-footer');
        
        if (circleTitle) circleTitle.textContent = circle.title;
        if (circleSubtitle) circleSubtitle.textContent = circle.subtitle;
        if (circleFooter) circleFooter.textContent = circle.footer;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
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
    // First check if it's a featured article
    if (siteContent.featuredArticles?.content?.[articleId]) {
        // Handle featured article content
        appState.currentArticle = articleId;
        appState.scrollPosition = window.scrollY || document.documentElement.scrollTop;
        
        if (appState.isDesktop) {
            domElements.articleDetail.style.display = 'block';
            domElements.articleDetail.innerHTML = siteContent.featuredArticles.content[articleId];
            
            domElements.blogSections.forEach(section => {
                section.style.display = 'none';
            });
        } else {
            document.body.classList.add('article-open');
            document.body.style.overflow = 'hidden';
            
            domElements.articleDetail.style.display = 'block';
            domElements.articleDetail.classList.add('visible');
            domElements.articleDetail.innerHTML = siteContent.featuredArticles.content[articleId];
            
            domElements.articleDetail.scrollTop = 0;
        }
        
        initInteractiveElements();
        return;
    }
    
    // Handle regular blog articles
    const article = siteContent.blogSlider?.find(a => a.id === articleId);
    if (!article) {
        console.error('Article not found:', articleId);
        return;
    }
    
    appState.currentArticle = articleId;
    appState.scrollPosition = window.scrollY || document.documentElement.scrollTop;
    
    if (appState.isDesktop) {
        domElements.articleDetail.style.display = 'block';
        domElements.articleDetail.innerHTML = generateArticleHTML(article);
        
        domElements.blogSections.forEach(section => {
            section.style.display = 'none';
        });
    } else {
        document.body.classList.add('article-open');
        document.body.style.overflow = 'hidden';
        
        domElements.articleDetail.style.display = 'block';
        domElements.articleDetail.classList.add('visible');
        domElements.articleDetail.innerHTML = generateArticleHTML(article);
        
        domElements.articleDetail.scrollTop = 0;
    }
    
    initInteractiveElements();
}

function generateArticleHTML(article) {
    return `
        <a href="#" class="back-button">← Назад к статьям</a>
        <time datetime="${article.date}">${formatDate(article.date)}</time>
        <h2>${article.title.replace(/<span>/g, '').replace(/<\/span>/g, '')}</h2>
        <div class="blog-detail">
            <span>${article.author}</span>
            <span>${article.readTime}</span>
        </div>
        ${article.content}
    `;
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
            if (articleId) {
                showArticle(articleId);
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
    // Load content from JSON first
    await loadContentFromJSON();
    
    // Set initial layout mode
    if (appState.isDesktop) {
        enableDesktopLayout();
    } else {
        initMobileMenu();
    }
    
    // Initialize interactive elements
    initInteractiveElements();
    
    // Add resize handler
    window.addEventListener('resize', debounce(handleResize, 250));
}

// Initialize when DOM is ready
if (document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}
