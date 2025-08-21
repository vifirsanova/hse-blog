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
    scrollListeners: null,
    isHorizontalScrollEnabled: false
};

// Article templates
const articleTemplates = {
    'prompt-engineering': `
        <h2>Промпт-инжиниринг</h2>
        <p><strong>Как научиться создавать промпты эффективно и решать абсолютные любые задачи за секунды.</strong></p>
        <p>Промпт-инжиниринг - это искусство формулировки запросов к искусственному интеллекту таким образом, чтобы получать максимально точные и полезные ответы. В этой статье мы рассмотрим:</p>
        <ul>
            <li>Основные принципы составления эффективных промптов</li>
            <li>Техники последовательного уточнения запросов</li>
            <li>Примеры сложных задач и их решения через правильные формулировки</li>
            <li>Инструменты для тестирования и оптимизации промптов</li>
        </ul>
        <p>Освоив эти техники, вы сможете получать от нейросетей именно то, что вам нужно, с первого запроса.</p>
        <a href="#" class="back-button">← Назад к статьям</a>
    `,
    'ai-law': `
        <h2>Нейросети и право</h2>
        <p><strong>Подборка ресурсов о вопросах права в искусственном интеллекте.</strong></p>
        <p>С развитием генеративного ИИ возникло множество правовых вопросов, особенно в области авторского права и ответственности за созданный контент.</p>
        <h3>Ключевые аспекты:</h3>
        <ul>
            <li>Авторское право на контент, созданный ИИ</li>
            <li>Ответственность за misinformation (ложную информацию)</li>
            <li>Регулирование использования персональных данных для обучения моделей</li>
            <li>Международные различия в подходе к регулированию ИИ</li>
        </ul>
        <p>В статье представлен анализ текущего законодательства и прогнозы его развития в ближайшие годы.</p>
        <a href="#" class="back-button">← Назад к статьям</a>
    `,
    'digital-authorship': `
        <h2>Авторство в цифровую эпоху</h2>
        <p><strong>Как развитие генеративного искусственного интеллекта влияет на развитие творческих индустрий.</strong></p>
        <p>Генеративный ИИ бросает вызов традиционным представлениям об авторстве и творческом процессе.</p>
        <h3>Основные темы:</h3>
        <ul>
            <li>Изменение роли художника/писателя в эпоху ИИ</li>
            <li>Кейсы успешного симбиоза человека и ИИ в творчестве</li>
            <li>Экономические последствия для творческих профессий</li>
            <li>Этические дилеммы использования ИИ в искусстве</li>
        </ul>
        <p>Статья включает интервью с художниками, писателями и музыкантами, экспериментирующими с ИИ-инструментами.</p>
        <a href="#" class="back-button">← Назад к статьям</a>
    `,
    'under-the-hood': `
        <h2>Под капотом</h2>
        <p><strong>Материалы для профессиональных разработчиков систем искусственного интеллекта.</strong></p>
        <p>Технический разбор современных архитектур нейросетей и методов их обучения.</p>
        <h3>Содержание:</h3>
        <ul>
            <li>Оптимизация больших языковых моделей</li>
            <li>Методы эффективного обучения с ограниченными данными</li>
            <li>Интерпретируемость и объяснимость моделей</li>
            <li>Эксперименты с новыми архитектурами</li>
        </ul>
        <p>Для технических специалистов: примеры кода, бенчмарки и практические рекомендации по реализации.</p>
        <a href="#" class="back-button">← Назад к статьям</a>
    `
};

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
    
    appState.isHorizontalScrollEnabled = false;
}

function disableDesktopLayout() {
    if (!appState.isHorizontalScrollEnabled) return;
    
    // Reset styles for mobile
    domElements.container.style.overflowX = 'hidden';
    domElements.container.style.overflowY = 'auto';
    
    domElements.blogSections.forEach(section => {
        section.style.overflowY = 'visible';
        section.style.overflowX = 'hidden';
    });
    
    appState.isHorizontalScrollEnabled = false;
}

function showArticle(articleId) {
    if (!articleTemplates[articleId]) return;
    
    appState.currentArticle = articleId;
    
    if (appState.isDesktop) {
        // Desktop behavior - show in place
        domElements.articleDetail.style.display = 'block';
        domElements.articleDetail.innerHTML = articleTemplates[articleId];
        
        // Hide other sections
        domElements.blogSections.forEach(section => {
            section.style.display = 'none';
        });
    } else {
        // Mobile behavior - transition
        if (domElements.mainContent) {
            domElements.mainContent.classList.remove('visible');
            domElements.mainContent.classList.add('hidden');
        }
        
        domElements.articleDetail.style.display = 'block';
        domElements.articleDetail.classList.remove('hidden');
        domElements.articleDetail.classList.add('visible');
        domElements.articleDetail.innerHTML = articleTemplates[articleId];
    }
    
    history.pushState({ article: articleId }, '', `#${articleId}`);
    window.scrollTo(0, 0);
    domElements.articleDetail.focus();
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
        // Mobile behavior - transition
        if (domElements.mainContent) {
            domElements.mainContent.classList.remove('hidden');
            domElements.mainContent.classList.add('visible');
        }
        
        domElements.articleDetail.classList.remove('visible');
        domElements.articleDetail.classList.add('hidden');
        
        setTimeout(() => {
            domElements.articleDetail.style.display = 'none';
        }, 300);
    }
    
    history.pushState({}, '', window.location.pathname);
    window.scrollTo(0, 0);
    document.body.focus();
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
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            showArticleList();
        });
    });
    
    // Handle read more links - FIXED for mobile
    document.querySelectorAll('.read-more').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const articleId = href.substring(1);
                showArticle(articleId);
            }
        });
    });
    
    // Also handle the main article read more links
    document.querySelectorAll('.blog-slider__readmore').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // You might want to add actual article IDs to these links
            // For now, let's show the first article as an example
            showArticle('prompt-engineering');
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

function init() {
    // Set initial layout mode
    if (appState.isDesktop) {
        enableDesktopLayout();
    } else {
        initMobileMenu();
    }
    
    // Initialize interactive elements
    initInteractiveElements();
    
    // Handle initial URL state
    if (window.location.hash) {
        const articleId = window.location.hash.substring(1);
        showArticle(articleId);
    }
    
    // Event listeners
    window.addEventListener('resize', debounce(handleResize, 100));
    window.addEventListener('orientationchange', () => setTimeout(handleResize, 300));
    window.addEventListener('popstate', () => {
        if (window.location.hash) {
            const articleId = window.location.hash.substring(1);
            showArticle(articleId);
        } else {
            showArticleList();
        }
    });
}

// Initialize when DOM is ready
if (document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}
