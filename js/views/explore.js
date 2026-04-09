import DataManager from '../data-manager.js';
import Router from '../router.js';

let selectedCategories = new Set();
let searchQuery = '';
let currentExploreView = 'all';
let selectedYear = null;

export function renderExplore(container) {
    const years = DataManager.getChapterYears();

    container.innerHTML = `
        <nav class="page-nav">
            <div class="container">
                <a href="#/" class="nav-back">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M13 16l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Home
                </a>
                <div class="nav-links">
                    <a href="#/origins">Origins</a>
                    <a href="#/chapters">Chapters</a>
                    <a href="#/prophecies">Prophecies</a>
                    <a href="#/cosmic">Cosmic Framework</a>
                </div>
            </div>
        </nav>

        <header class="explore-header">
            <div class="container">
                <h1 class="site-title">${DataManager.getSiteConfig().title || 'Kalki Maa Noor Ananta'}</h1>
                <p class="site-subtitle">Explore All Events</p>
                <div class="header-stats">
                    <div class="stat-item">
                        <span class="stat-number">${DataManager.getStats().total_events || 0}</span>
                        <span class="stat-label">Events</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${DataManager.getStats().total_years || 0}</span>
                        <span class="stat-label">Years</span>
                    </div>
                </div>
            </div>
        </header>

        <div class="explore-controls">
            <div class="container">
                <div class="nav-content">
                    <div class="nav-controls">
                        <button class="btn btn-primary active" id="view-all-btn">All Events</button>
                        <button class="btn btn-secondary" id="timeline-view-btn">Timeline</button>
                    </div>
                    <div class="search-container">
                        <input type="text" id="search-input" placeholder="Search events, messages, predictions..." class="search-input" value="${searchQuery}">
                    </div>
                    <button class="btn btn-secondary" id="filter-btn">Filter</button>
                </div>
            </div>
        </div>

        <div id="filter-panel" class="filter-panel hidden">
            <div class="container">
                <div class="filter-content">
                    <div class="filter-header">
                        <h3>Filter by Category</h3>
                        <button id="clear-filters-btn" class="btn-text">Clear All</button>
                    </div>
                    <div id="category-filters" class="category-filters"></div>
                </div>
            </div>
        </div>

        <div id="year-navigation" class="year-navigation hidden">
            <div class="container">
                <div class="year-nav-scroll" id="year-nav-scroll"></div>
            </div>
        </div>

        <main class="main-content">
            <div class="container">
                <div id="timeline-container" class="timeline-container"></div>
                <div id="no-results" class="no-results hidden">
                    <h3>No events found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            </div>
        </main>

        <footer class="site-footer">
            <div class="container">
                <p class="footer-tagline">A Timeline for the Next 8000 Years</p>
            </div>
        </footer>
    `;

    initExploreListeners(container);
    renderCategoryFilters(container);
    renderExploreEvents(container);
}

function initExploreListeners(container) {
    container.querySelector('#view-all-btn').addEventListener('click', () => {
        currentExploreView = 'all';
        container.querySelector('#view-all-btn').classList.add('active');
        container.querySelector('#timeline-view-btn').classList.remove('active');
        container.querySelector('#year-navigation').classList.add('hidden');
        selectedYear = null;
        renderExploreEvents(container);
    });

    container.querySelector('#timeline-view-btn').addEventListener('click', () => {
        currentExploreView = 'timeline';
        container.querySelector('#timeline-view-btn').classList.add('active');
        container.querySelector('#view-all-btn').classList.remove('active');
        container.querySelector('#year-navigation').classList.remove('hidden');
        if (!selectedYear) {
            const years = DataManager.getChapterYears();
            selectedYear = years[years.length - 1];
        }
        renderYearNav(container);
        renderExploreEvents(container);
    });

    container.querySelector('#search-input').addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderExploreEvents(container);
    });

    container.querySelector('#filter-btn').addEventListener('click', () => {
        container.querySelector('#filter-panel').classList.toggle('hidden');
    });

    container.querySelector('#clear-filters-btn').addEventListener('click', () => {
        selectedCategories.clear();
        container.querySelectorAll('.category-tag').forEach(t => t.classList.remove('active'));
        renderExploreEvents(container);
    });
}

function renderYearNav(container) {
    const yearNav = container.querySelector('#year-nav-scroll');
    const years = DataManager.getChapterYears().reverse();

    yearNav.innerHTML = years.map(year => `
        <button class="year-btn ${selectedYear == year ? 'active' : ''}" data-year="${year}">
            ${year} (${DataManager.getEventsForYear(year).length})
        </button>
    `).join('');

    yearNav.querySelectorAll('.year-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedYear = btn.dataset.year;
            renderYearNav(container);
            renderExploreEvents(container);
        });
    });
}

function renderCategoryFilters(container) {
    const categories = DataManager.timelineData?.all_categories || [];
    const counts = DataManager.timelineData?.category_counts || {};
    const filterContainer = container.querySelector('#category-filters');

    filterContainer.innerHTML = categories.map(cat => `
        <button class="category-tag ${selectedCategories.has(cat) ? 'active' : ''}" data-category="${cat}">
            ${cat.replace(/_/g, ' ')} ${counts[cat] ? `(${counts[cat]})` : ''}
        </button>
    `).join('');

    filterContainer.querySelectorAll('.category-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const cat = tag.dataset.category;
            if (selectedCategories.has(cat)) {
                selectedCategories.delete(cat);
                tag.classList.remove('active');
            } else {
                selectedCategories.add(cat);
                tag.classList.add('active');
            }
            renderExploreEvents(container);
        });
    });
}

function renderExploreEvents(container) {
    const eventsContainer = container.querySelector('#timeline-container');
    const noResults = container.querySelector('#no-results');

    let events = DataManager.filterEvents(selectedCategories, searchQuery);

    if (currentExploreView === 'timeline' && selectedYear) {
        events = events.filter(e => String(e.year) === String(selectedYear));
    }

    if (events.length === 0) {
        eventsContainer.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }

    noResults.classList.add('hidden');

    const eventsByYear = {};
    events.forEach(e => {
        if (!eventsByYear[e.year]) eventsByYear[e.year] = [];
        eventsByYear[e.year].push(e);
    });

    const years = Object.keys(eventsByYear).sort((a, b) => b - a);

    eventsContainer.innerHTML = years.map(year => `
        <div class="year-section">
            <div class="year-header">
                <h2>${year}</h2>
                <div class="year-divider"></div>
                <span class="event-count">${eventsByYear[year].length} events</span>
            </div>
            <div class="events-grid">
                ${eventsByYear[year].map(event => renderExploreCard(event)).join('')}
            </div>
        </div>
    `).join('');

    eventsContainer.querySelectorAll('.event-card').forEach(card => {
        card.addEventListener('click', () => {
            Router.navigate(`/event/${card.dataset.eventId}`);
        });
    });
}

function renderExploreCard(event) {
    const imagePath = event.has_image ? DataManager.getImagePath(event) : '';
    const importanceClass = event.importance >= 15 ? 'high-importance' :
                           event.importance >= 10 ? 'medium-importance' : '';
    const displayTags = [...event.categories, ...event.themes].slice(0, 4);

    return `
        <div class="event-card ${importanceClass}" data-event-id="${event.id}">
            ${event.has_image ? `
                <img src="${imagePath}" alt="Event ${event.date}" class="event-image" loading="lazy" onerror="this.style.display='none'">
            ` : ''}
            <div class="event-content">
                <div class="event-date">${DataManager.formatDate(event.date)}</div>
                <p class="event-description">${event.description || 'View details...'}</p>
                ${displayTags.length > 0 ? `
                    <div class="event-keywords">
                        ${displayTags.map(t => `<span class="keyword-badge">${t.replace(/_/g, ' ')}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}
