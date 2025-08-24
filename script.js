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
    `,
    'prompt-vs-art': `
        <h2>Промпт-инжиниринг - это искусство?</h2>
        <p><strong>Взгляд со стороны авторского права на процесс создания промптов для генеративного ИИ и их правовой статус.</strong></p>
        
        <p>Промпт-инжиниринг сегодня часто называют «новой грамотой цифровой эпохи» или даже искусством общения с машиной. Это навык, на первый взгляд сугубо технический — ведь речь идёт всего лишь о том, чтобы «правильно» задать вопрос искусственному интеллекту. Но чем глубже мы погружаемся в мир генеративных моделей, тем яснее становится: хороший промпт — это не просто команда. Это элемент творчества, построенный на знании языка, культуры, визуальных и литературных кодов. Возникает вопрос: можно ли рассматривать такие промпты как результат творческого труда? И если да, заслуживают ли они защиты авторским правом?</p>
        
        <h3>Что такое промпт-инжиниринг?</h3>
        <p>Промпт-инжиниринг — это дисциплина, которая занимается разработкой и оптимизацией текстовых запросов (промптов) для генеративных моделей искусственного интеллекта. Качественный промпт должен быть:</p>
        <ul>
            <li>Конкретным и однозначным</li>
            <li>Учитывающим контекст и стиль</li>
            <li>Содержащим нужные ключевые элементы</li>
            <li>Адаптированным под конкретную модель ИИ</li>
        </ul>
        
        <h3>Творческий аспект промпт-инжиниринга</h3>
        <p>Создание эффективных промптов требует не только технических знаний, но и творческого подхода. Хороший промпт-инженер должен:</p>
        <ul>
            <li>Понимать принципы композиции и стиля</li>
            <li>Владеть искусством убедительной коммуникации</li>
            <li>Уметь предвидеть результаты генерации</li>
            <li>Обладать развитым эстетическим вкусом</li>
        </ul>
        
        <h3>Правовой статус промптов</h3>
        <p>Ответ не так однозначен. Промпт может быть просто командой — «сделай красиво». А может — самостоятельным творческим высказыванием, в котором отражаются стиль, вкус и интенция автора. И пока закон не предлагает чётких ответов, вопрос остаётся открытым для дискуссии — как среди юристов, так и среди самих создателей промптов.</p>
        
        <p>Промпт-инжиниринг — это не просто инструмент взаимодействия с ИИ. Это новая форма креативности на стыке языка, технологий и визуального мышления. И, возможно, в будущем мы увидим отдельную категорию правовой охраны — не только для результатов генерации, но и для того, что лежит в их основе: человеческой идеи, выраженной в словах.</p>
        
        <h3>Перспективы развития</h3>
        <p>С развитием генеративного ИИ промпт-инжиниринг становится всё более востребованной профессией. Крупные компании уже нанимают специалистов по промпт-инжинирингу, а образовательные учреждения начинают предлагать соответствующие курсы и программы.</p>
        
        <p>В будущем мы можем ожидать появления специализированных инструментов для создания и оптимизации промптов, а также развития стандартов и лучших практик в этой области.</p>
        
        <a href="#" class="back-button">← Назад к статьям</a>
    `,
    'new-genre': `
        <h2>Нейроискусство: новый жанр</h2>
        <p><strong>Как ИИ меняет представления о творческом процессе в визуальном искусстве и дизайне.</strong></p>
        
        <p>Нейроискусство стало одним из самых обсуждаемых феноменов в современном культурном пространстве. С помощью генеративных моделей художники создают работы, которые бросают вызов традиционным представлениям о творчестве и авторстве.</p>
        
        <h3>История развития нейроискусства</h3>
        <p>Нейроискусство зародилось в начале 2010-х годов, когда исследователи начали экспериментировать с использованием нейронных сетей для создания визуальных образов. Первые работы были скорее техническими экспериментами, но постепенно нейроискусство стало признанным направлением современного искусства.</p>
        
        <h3>Ключевые техники и подходы</h3>
        <p>Современные художники, работающие с ИИ, используют различные техники:</p>
        <ul>
            <li>Генеративно-состязательные сети (GANs) для создания изображений</li>
            <li>Трансформеры для генерации текста и поэзии</li>
            <li>Нейронные стили для переноса художественного стиля</li>
            <li>Генеративные модели для создания музыки и звука</li>
        </ul>
        
        <h3>Правовые аспекты признания нейроискусства</h3>
        <p>Признание нейроискусства как художественного жанра сталкивается с рядом правовых challenges:</p>
        <ul>
            <li>Вопросы авторства и соавторства с ИИ</li>
            <li>Правовой статус произведений, созданных с помощью ИИ</li>
            <li>Проблемы охраноспособности и оригинальности</li>
            <li>Вопросы коммерческого использования нейроискусства</li>
        </ul>
        
        <h3>Знаковые проекты и выставки</h3>
        <p>За последние годы прошло несколько значительных выставок нейроискусства:</p>
        <ul>
            <li>«ИИ: больше чем человек» в Барбикан-центре (Лондон)</li>
            <li>«Нейроискусство» в ЦВЗ «Манеж» (Москва)</li>
            <li>«Генерируя будущее» в галерее Тейт Модерн (Лондон)</li>
        </ul>
        
        <h3>Эстетические особенности нейроискусства</h3>
        <p>Нейроискусство характеризуется рядом уникальных эстетических качеств:</p>
        <ul>
            <li>Гибридность человеческого и машинного творчества</li>
            <li>Эмерджентность — возникновение непредсказуемых результатов</li>
            <li>Интерактивность и изменчивость произведений</li>
            <li>Специфическая «нейроэстетика» визуального языка</li>
        </ul>
        
        <p>Нейроискусство продолжает эволюционировать, предлагая новые формы эстетического выражения и ставя перед нами важные вопросы о природе творчества в цифровую эпоху.</p>
        
        <h3>Будущее нейроискусства</h3>
        <p>С развитием технологий нейроискусство будет становиться всё более sophisticated. Мы можем ожидать появления:</p>
        <ul>
            <li>Более сложных и nuanced произведений</li>
            <li>Новых форм интерактивного и иммерсивного искусства</li>
            <li>Интеграции ИИ в традиционные художественные практики</li>
            <li>Развития рынка и инфраструктуры для нейроискусства</li>
        </ul>
        
        <a href="#" class="back-button">← Назад к статьям</a>
    `,
    'authorship-ai-age': `
        <h2>Авторство в эпоху ИИ</h2>
        <p><strong>Может ли искусственный интеллект быть признан автором произведения с точки зрения современного права.</strong></p>
        
        <p>Для получения охраны произведение должно соответствовать трём основным критериям:</p>
        <ol>
            <li>Оригинальность — то есть быть результатом индивидуального, творческого выбора;</li>
            <li>Выраженность в объективной форме — его можно зафиксировать (на бумаге, в файле и т.д.);</li>
            <li>Человеческое авторство — произведение должно быть создано человеком (по крайней мере на сегодняшний день именно такова позиция большинства правопорядков).</li>
        </ol>
        
        <h3>Текущее состояние законодательства</h3>
        <p>В настоящее время большинство юрисдикций не признают ИИ в качестве автора. Однако с развитием технологий этот вопрос становится всё более актуальным.</p>
        
        <p>В разных странах подходы к этому вопросу vary:</p>
        <ul>
            <li>В США авторское право защищает только произведения, созданные человеком</li>
            <li>В Европейском союзе обсуждается возможность признания ограниченных прав на произведения, созданные ИИ</li>
            <li>В Великобритании существует специальный режим для computer-generated works</li>
            <li>В Китае и Японии подходы более гибкие и ориентированы на поддержку innovation</li>
        </ul>
        
        <h3>Подходы к решению проблемы авторства ИИ</h3>
        <p>В статье рассматриваются различные подходы к решению этой проблемы:</p>
        <ul>
            <li>Расширение понятия "автор" для включения искусственного интеллекта</li>
            <li>Создание специального правового режима для произведений, созданных ИИ</li>
            <li>Признание автором человека, инициировавшего создание произведения</li>
            <li>Разработка системы соавторства человека и ИИ</li>
            <li>Отказ от предоставления авторско-правовой охраны произведениям ИИ</li>
        </ul>
        
        <h3>Международные инициативы</h3>
        <p>На международном уровне ведутся активные дискуссии о регулировании авторского права для ИИ:</p>
        <ul>
            <li>ВОИС (Всемирная организация интеллектуальной собственности) проводит обсуждения по вопросам ИИ и ИС</li>
            <li>Европейская комиссия разрабатывает Регламент об искусственном интеллекте</li>
            <li>ЮНЕСКО работает над Рекомендацией по этике ИИ</li>
            <li>Страны "Большой семерки" обсуждают общие принципы регулирования ИИ</li>
        </ul>
        
        <h3>Практические implications</h3>
        <p>Вопрос авторства ИИ имеет важные практические последствия:</p>
        <ul>
            <li>Для создателей контента — определение прав на произведения</li>
            <li>Для бизнеса — ясность в вопросах коммерческого использования</li>
            <li>Для общества — баланс между стимулированием innovation и защитой авторов</li>
            <li>Для правоприменительной практики — определённость в судебных спорах</li>
        </ul>
        
        <h3>Будущее авторского права в эпоху ИИ</h3>
        <p>С развитием технологий нам потребуется переосмыслить традиционные концепции авторского права. Возможные направления развития:</p>
        <ul>
            <li>Разработка гибких правовых режимов, адаптированных к технологическим изменениям</li>
            <li>Создание международных стандартов для cross-border использования произведений ИИ</li>
            <li>Развитие технических средств идентификации и атрибуции произведений</li>
            <li>Внедрение новых бизнес-моделей монетизации контента, созданного ИИ</li>
        </ul>
        
        <p>Авторское право в эпоху ИИ стоит на пороге фундаментальных изменений, которые потребуют careful balancing между protection инноваций и сохранением фундаментальных принципов интеллектуальной собственности.</p>
        
        <a href="#" class="back-button">← Назад к статьям</a>
    `,
    'under-the-hood': `
        <h2>Под капотом</h2>
        <p><strong>Материалы для профессиональных разработчиков систем искусственного интеллекта.</strong></p>
        <p>Технический разбор современных архитектур нейросетей и методов их обучения. Для понимания правовых аспектов ИИ необходимо разбираться в технических особенностях работы этих систем.</p>
        <h3>Содержание:</h3>
        <ul>
            <li>Архитектуры генеративных моделей (GAN, VAE, Transformers)</li>
            <li>Методы обучения с учителем и без учителя</li>
            <li>Проблема интерпретируемости решений нейросетей</li>
            <li>Этические аспекты разработки ИИ-систем</li>
            <li>Технические средства обеспечения прозрачности и accountability</li>
        </ul>
        <p>Для технических специалистов: примеры кода, бенчмарки и практические рекомендации по реализации. Статья будет полезна как разработчикам, так и юристам, работающим в области технологического права.</p>
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
    if (!articleTemplates[articleId]) return;
    
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

function init() {
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
