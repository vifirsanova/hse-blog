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

class ContentManager {
    constructor() {
        this.content = {};
        this.articles = new Map();
        this.isLoaded = false;
    }

    async load() {
        if (this.isLoaded) return true;
        
        try {
            const response = await fetch('https://raw.githubusercontent.com/vifirsanova/hse-blog/refs/heads/content-refinements/assets/preview.json');
            if (!response.ok) throw new Error('Failed to load content');
            
            this.content = await response.json();
            this.processContent();
            this.isLoaded = true;
            
            console.log('Content loaded and processed successfully');
            return true;
        } catch (error) {
            console.error('Error loading content:', error);
            return false;
        }
    }

    // Метод для генерации ID из заголовка
    generateArticleId(id) {
        return id
            .toLowerCase()
            .substring(0, 50);
    }

    processContent() {
        // Обрабатываем статьи из блога
        if (this.content.blogSlider) {
            this.content.blogSlider.forEach(article => {
                const articleId = this.generateArticleId(article.id);
                article.id = articleId;
                article.link = `#${articleId}`;
                
                this.articles.set(articleId, {
                    type: 'blog',
                    data: article
                });
            });
        }

        // Обрабатываем экспертные мнения
        if (this.content.expertOpinions?.opinions) {
            this.content.expertOpinions.opinions.forEach(opinion => {
                const id = this.generateArticleId(`expert-${opinion.name}`);
                opinion.id = id;
                opinion.link = `#${id}`;
                
                this.articles.set(id, {
                    type: 'expert',
                    data: opinion
                });
            });
        }

        // Обрабатываем избранные статьи
        if (this.content.featuredArticles?.articles) {
            this.content.featuredArticles.articles.forEach(article => {
                const articleId = this.generateArticleId(article.title);
                article.id = articleId;
                article.link = `#${articleId}`;
                
                if (!this.articles.has(articleId)) {
                    this.articles.set(articleId, {
                        type: 'featured',
                        data: article
                    });
                }
            });
        }
        
        // Обрабатываем открытые вопросы (если есть)
        if (this.content.openQuestions) {
            // Генерируем ID для каждого вопроса
            this.content.openQuestions.questions.forEach((question, index) => {
                const id = this.generateArticleId(`question-${index}`);
                if (!this.articles.has(id)) {
                    this.articles.set(id, {
                        type: 'question',
                        data: {
                            id: id,
                            title: `Вопрос: ${question.substring(0, 50)}...`,
                            question: question,
                            content: `<div style="max-width:800px; margin:0 auto; padding:20px;">
                                <a href="#" class="back-button">← Назад к статьям</a>
                                <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 2rem; margin-bottom: 1.5rem;">${question}</h2>
                                <div style="line-height: 1.7; font-size: 1.1rem;">
                                    <p>Этот вопрос является частью нашего банка открытых вопросов для междисциплинарного обсуждения.</p>
                                    <p>Присоединяйтесь к дискуссии на наших встречах или напишите нам свои мысли по этому вопросу.</p>
                                </div>
                            </div>`
                        }
                    });
                }
            });
        }
    }

    getArticle(id) {
        return this.articles.get(id);
    }

    getBlogArticles() {
        return this.content.blogSlider || [];
    }

    getExpertOpinions() {
        return this.content.expertOpinions || {};
    }

    getFeaturedArticles() {
        return this.content.featuredArticles || {};
    }
}

// Глобальный экземпляр менеджера контента
const contentManager = new ContentManager();

function renderExpertOpinions() {
    const expertOpinions = contentManager.getExpertOpinions();
    if (!expertOpinions.heading || !domElements.stickyHeader) return;
    
    const opinionsSection = domElements.stickyHeader.querySelector('.expert-opinions');
    if (!opinionsSection) return;
    
    // Обновляем заголовок секции
    const sectionHeader = opinionsSection.querySelector('.section-header');
    if (sectionHeader) {
        const headingElement = sectionHeader.querySelector('h2');
        const subheadingElement = sectionHeader.querySelector('p');
        
        if (headingElement) headingElement.textContent = expertOpinions.heading;
        if (subheadingElement) subheadingElement.textContent = expertOpinions.subheading;
    }
    
    // Рендерим карточки мнений
    const opinionsGrid = opinionsSection.querySelector('.opinions-grid');
    if (opinionsGrid && expertOpinions.opinions) {
        opinionsGrid.innerHTML = '';
        
        expertOpinions.opinions.forEach(opinion => {
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
    
    // Добавляем банк открытых вопросов
    const openQuestions = contentManager.content.openQuestions;
    if (openQuestions && openQuestions.html) {
        const stickyContent = domElements.stickyHeader.querySelector('.sticky-content');
        if (stickyContent) {
            // Вставляем банк вопросов после описания
            const description = stickyContent.querySelector('p');
            if (description && !stickyContent.querySelector('.open-questions')) {
                description.insertAdjacentHTML('afterend', openQuestions.html);
                // Инициализируем обработчики для вопросов
                setTimeout(initQuestionHandlers, 100);
            }
        }
    }
}

function renderBlogSlider() {
    const blogArticles = contentManager.getBlogArticles();
    if (!blogArticles.length || !domElements.blogSlider) return;
    
    const sliderWrp = domElements.blogSlider.querySelector('.blog-slider__wrp');
    if (!sliderWrp) return;
    
    sliderWrp.innerHTML = '';
    
    blogArticles.forEach(article => {
        const articleElement = document.createElement('article');
        articleElement.className = 'blog-slider__item';
        articleElement.setAttribute('data-article-id', article.id);
        
        articleElement.innerHTML = `
            <div class="blog-slider__content">
                <time class="blog-slider__date" datetime="${article.date}">${formatDate(article.date)}</time>
                <h2 class="blog-slider__title">${article.title}</h2>
                
                <div class="blog-slider__img">
                    <img src="${article.image}" alt="${article.alt}" width="800" height="400" loading="lazy" 
                         style="width: 100%; height: auto; border-radius: 12px; margin: 16px 0; filter: grayscale(1);">
                </div>
                
                <div class="blog-detail">
                    <span>${article.author}</span> · 
                    <span>${article.readTime}</span>
                </div>
                
                <div class="blog-slider__text" style="line-height: 1.6; margin: 16px 0; color: #161419;">
                    ${article.excerpt}
                </div>
                
                <a href="${article.link}" class="blog-slider__readmore" aria-label="Читать статью '${article.title.replace(/<[^>]*>/g, '')}'" data-article-id="${article.id}">
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
    const featuredArticles = contentManager.getFeaturedArticles();
    if (!featuredArticles || !domElements.featuredArticles) return;
    
    const { marquee, heading, articles, circle } = featuredArticles;
    
    // Обновляем бегущую строку
    const marqueeContainer = domElements.featuredArticles.querySelector('.marquee-container');
    if (marqueeContainer) {
        const marqueeElement = marqueeContainer.querySelector('.marquee');
        if (marqueeElement) {
            let marqueeHTML = '';
            [...marquee, ...marquee].forEach(text => {
                marqueeHTML += `<span>${text}</span>`;
            });
            marqueeElement.innerHTML = marqueeHTML;
        }
    }
    
    // Обновляем заголовок
    const featuredTitle = domElements.featuredArticles.querySelector('.featured-title');
    if (featuredTitle) {
        featuredTitle.textContent = heading;
    }
    
    // Рендерим статьи
    const articlesContainer = domElements.featuredArticles;
    const titleContainer = articlesContainer.querySelector('.featured-title-container');
    const existingArticles = articlesContainer.querySelectorAll('.featured-article');
    
    existingArticles.forEach(article => article.remove());
    
    if (articles) {
        articles.forEach(article => {
            const articleElement = document.createElement('article');
            articleElement.className = 'featured-article';
            articleElement.setAttribute('data-article-id', article.id);
            
            articleElement.innerHTML = `
                <div class="article-number" aria-hidden="true">${article.number}</div>
                <div class="article-content">
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-subtitle">${article.subtitle} <a href="${article.link}" class="read-more">Узнать больше..</a></p>
                </div>
            `;
            
            titleContainer.parentNode.insertBefore(articleElement, titleContainer.nextSibling);
        });
    }
    
    // Обновляем элемент circle
    const circleElement = domElements.featuredArticles.querySelector('.circle');
    if (circleElement && circle) {
        const circleTitle = circleElement.querySelector('.circle-title');
        const circleSubtitle = circleElement.querySelector('.circle-subtitle');
        const circleFooter = circleElement.querySelector('.circle-footer');
        
        if (circleTitle) circleTitle.textContent = circle.title;
        if (circleSubtitle) circleSubtitle.textContent = circle.subtitle;
        if (circleFooter) circleFooter.textContent = circle.footer;
    }
}

function createArticleDetailHTML() {
    const articleDetail = document.getElementById('article-detail');
    if (!articleDetail) return;
    
    articleDetail.innerHTML = `
        <div class="article-share-container">
            <button class="share-button" aria-label="Поделиться статьей">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                Поделиться
            </button>
        </div>
        <div class="article-content-container"></div>
    `;
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

// Функция для обновления URL с якорем
function updateUrlWithHash(articleId) {
    const newUrl = `${window.location.pathname}${window.location.search}#${articleId}`;
    window.history.pushState({ articleId }, '', newUrl);
}

// Функция для инициализации кнопки "поделиться"
function initShareButton(articleId, articleTitle) {
    const shareButton = document.querySelector('.share-button');
    if (!shareButton) return;
    
    shareButton.onclick = () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}#${articleId}`;
        
        // Проверяем поддержку Web Share API
        if (navigator.share) {
            navigator.share({
                title: articleTitle,
                url: shareUrl
            }).catch(err => {
                console.log('Error sharing:', err);
                copyToClipboard(shareUrl);
            });
        } else {
            // Fallback: копирование в буфер обмена
            copyToClipboard(shareUrl);
        }
    };
}

// Функция для копирования в буфер обмена
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Ссылка скопирована в буфер обмена!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Ссылка скопирована в буфер обмена!');
        } catch (err) {
            showNotification('Не удалось скопировать ссылку');
        }
        document.body.removeChild(textArea);
    });
}

// Функция для показа уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--dark-bg);
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 10000;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

function showArticle(articleId) {
    const article = contentManager.getArticle(articleId);
    if (!article) {
        console.error('Article not found:', articleId);
        return;
    }
    
    appState.currentArticle = articleId;
    appState.scrollPosition = window.scrollY || document.documentElement.scrollTop;
    
    // Создаем HTML структуру если ее нет
    if (!document.querySelector('.article-share-container')) {
        createArticleDetailHTML();
    }
    
    // Обновляем URL с якорем
    updateUrlWithHash(articleId);
    
    // Заполняем контент
    const contentContainer = document.querySelector('.article-content-container');
    if (contentContainer) {
        contentContainer.innerHTML = generateArticleHTML(article);
    }
    
    if (appState.isDesktop) {
        domElements.articleDetail.style.display = 'block';
        domElements.blogSections.forEach(section => {
            section.style.display = 'none';
        });
    } else {
        document.body.classList.add('article-open');
        document.body.style.overflow = 'hidden';
        domElements.articleDetail.style.display = 'block';
        domElements.articleDetail.classList.add('visible');
        domElements.articleDetail.scrollTop = 0;
    }
    
    initInteractiveElements();
    initShareButton(articleId, article.data.title);
}

function generateArticleHTML(article) {
    let html = '';
    
    switch(article.type) {
        case 'blog':
            html = `
                <div style="max-width: 800px; margin: 0 auto;">
                    <a href="#" class="back-button">← Назад к статьям</a>
                    <time datetime="${article.data.date}" style="display: block; margin: 1rem 0; color: #666; font-size: 0.9rem;">${formatDate(article.data.date)}</time>
                    <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 2.5rem; margin-bottom: 1.5rem; line-height: 1.2;">${article.data.title.replace(/<span>/g, '').replace(/<\/span>/g, '')}</h2>
                    
                    <div style="margin: 1.5rem 0;">
                        <img src="${article.data.image}" alt="${article.data.alt}" style="width: 100%; height: auto; border-radius: 12px; filter: grayscale(1);">
                    </div>
                    
                    <div class="blog-detail" style="display: flex; gap: 1rem; margin: 1rem 0; color: #666; font-size: 0.9rem;">
                        <span>${article.data.author}</span> · 
                        <span>${article.data.readTime}</span>
                    </div>
                    
                    <div style="line-height: 1.7; font-size: 1.1rem;">
                        ${article.data.excerpt}
                        ${article.data.content || ''}
                    </div>
                </div>
            `;
            break;
            
        case 'featured':
            html = `
                <div style="max-width: 800px; margin: 0 auto;">
                    <a href="#" class="back-button">← Назад к статьям</a>
                    <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 2.5rem; margin-bottom: 1.5rem;">${article.data.title}</h2>
                    <div class="blog-detail" style="display: flex; gap: 1rem; margin: 1rem 0; color: #666; font-size: 0.9rem;">
                        <span>Избранная статья</span>
                    </div>
                    <div style="line-height: 1.7; font-size: 1.1rem;">
                        ${article.data.content || `<p>${article.data.subtitle}</p>`}
                    </div>
                </div>
            `;
            break;
            
        case 'expert':
            html = `
                <div style="max-width: 800px; margin: 0 auto;">
                    <a href="#" class="back-button">← Назад к статьям</a>
                    <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 2rem; margin-bottom: 1rem;">Мнение эксперта: ${article.data.name}</h2>
                    <div class="blog-detail" style="display: flex; gap: 1rem; margin: 1rem 0; color: #666; font-size: 0.9rem;">
                        <span>${article.data.affiliation}</span>
                    </div>
                    <blockquote style="border-left: 4px solid #121418; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; font-size: 1.2rem; line-height: 1.6;">
                        ${article.data.quote}
                    </blockquote>
                    <div class="expert-image" style="text-align: center; margin: 2rem 0;">
                        <img src="${article.data.image}" alt="${article.data.alt}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover;">
                    </div>
                </div>
            `;
            break;
            
        default:
            html = `<p>Контент не найден</p><a href="#" class="back-button">← Назад к статьям</a>`;
    }
    
    return html;
}

function showArticleList() {
    // Убираем якорь из URL
    if (window.location.hash) {
        window.history.replaceState({}, '', window.location.pathname + window.location.search);
    }
    
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
    // Обрабатываем кнопку "Назад" в деталях статьи
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            showArticleList();
        });
    }
    
    // Обрабатываем ссылки "Узнать больше" в избранных статьях
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
    
    // Обрабатываем основные ссылки "Читать далее"
    document.querySelectorAll('.blog-slider__readmore').forEach(link => {
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
    
    // Обрабатываем клики по избранным статьям
    document.querySelectorAll('.featured-article').forEach(article => {
        article.addEventListener('click', (e) => {
            e.preventDefault();
            const articleId = article.getAttribute('data-article-id');
            if (articleId) {
                showArticle(articleId);
            }
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

// Обработчик для загрузки страницы с якорем
function handleHashOnLoad() {
    if (window.location.hash) {
        const articleId = window.location.hash.substring(1);
        const article = contentManager.getArticle(articleId);
        if (article) {
            // Небольшая задержка для полной загрузки контента
            setTimeout(() => {
                showArticle(articleId);
            }, 100);
        }
    }
}

// Функция для переключения деталей вопросов
function toggleQuestionDetails(id) {
    const element = document.getElementById(id);
    if (element) {
        if (element.style.display === 'none' || !element.style.display) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    }
}

// Инициализация обработчиков для вопросов
function initQuestionHandlers() {
    // Добавляем обработчики для всех вопросов
    document.querySelectorAll('[onclick^=\"toggleQuestionDetails\"]').forEach(element => {
        element.style.cursor = 'pointer';
        element.addEventListener('click', (e) => {
            const id = e.target.getAttribute('onclick').match(/'([^']+)'/)[1];
            toggleQuestionDetails(id);
        });
    });
}

async function init() {
    // Загружаем контент через менеджер
    const success = await contentManager.load();
    
    if (!success) {
        console.error('Не удалось загрузить контент');
        return;
    }
    
    // Создаем HTML структуру для деталей статьи
    createArticleDetailHTML();
    
    // Рендерим контент
    renderExpertOpinions();
    renderBlogSlider();
    renderFeaturedArticles();
    
    // Устанавливаем начальный режим layout
    if (appState.isDesktop) {
        enableDesktopLayout();
    } else {
        initMobileMenu();
    }
    
    // Инициализируем интерактивные элементы
    initInteractiveElements();
    
    // Добавляем обработчик изменения размера
    window.addEventListener('resize', debounce(handleResize, 250));

    // Помечаем активный пункт меню
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.blog-menu').forEach(menuItem => {
        const href = menuItem.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            menuItem.classList.add('active');
        } else {
            menuItem.classList.remove('active');
        }
    });

    // Обрабатываем якорь при загрузке
    handleHashOnLoad();
    
    // Обрабатываем изменения hash
    window.addEventListener('hashchange', () => {
        if (window.location.hash) {
            const articleId = window.location.hash.substring(1);
            if (contentManager.getArticle(articleId)) {
                showArticle(articleId);
            }
        } else if (appState.currentArticle) {
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
