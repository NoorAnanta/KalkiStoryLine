// Enhanced app.js with storyline connections, better categorization, and URL handling

let timelineData = null;
let currentView = 'all';
let selectedYear = null;
let selectedCategories = new Set();
let selectedThemes = new Set();
let searchQuery = '';
let filterMode = 'categories'; // 'categories' or 'themes'

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    initializeEventListeners();
    renderInitialView();
});

async function loadData() {
    try {
        const response = await fetch('data/timeline_data.json');
        timelineData = await response.json();
        updateStats();
        hideLoadingScreen();
    } catch (error) {
        console.error('Error loading timeline data:', error);
        showError('Failed to load timeline data. Please refresh the page.');
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => loadingScreen.classList.add('hidden'), 500);
}

function showError(message) {
    document.getElementById('loading-screen').querySelector('p').textContent = message;
}

function updateStats() {
    if (!timelineData) return;
    document.getElementById('total-events').textContent = timelineData.stats.total_events;
    document.getElementById('total-years').textContent = timelineData.stats.total_years;
    document.getElementById('footer-years').textContent = timelineData.stats.years_covered;
}

function initializeEventListeners() {
    document.getElementById('view-all-btn').addEventListener('click', () => switchView('all'));
    document.getElementById('timeline-view-btn').addEventListener('click', () => switchView('timeline'));
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('search-btn').addEventListener('click', () => {
        handleSearch({ target: document.getElementById('search-input') });
    });
    document.getElementById('filter-btn').addEventListener('click', toggleFilterPanel);
    document.getElementById('clear-filters-btn').addEventListener('click', clearFilters);
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            document.getElementById('search-input').focus();
        }
    });
}

function switchView(view) {
    currentView = view;
    document.getElementById('view-all-btn').classList.toggle('active', view === 'all');
    document.getElementById('timeline-view-btn').classList.toggle('active', view === 'timeline');
    
    const yearNav = document.getElementById('year-navigation');
    if (view === 'timeline') {
        yearNav.classList.remove('hidden');
        renderYearNavigation();
        if (!selectedYear && timelineData) {
            selectedYear = Math.max(...Object.keys(timelineData.years).map(Number));
        }
    } else {
        yearNav.classList.add('hidden');
        selectedYear = null;
    }
    
    renderEvents();
}

function renderYearNavigation() {
    if (!timelineData) return;
    
    const yearNav = document.getElementById('year-nav-scroll');
    const years = Object.keys(timelineData.years).sort((a, b) => b - a);
    
    yearNav.innerHTML = years.map(year => `
        <button class="year-btn ${selectedYear == year ? 'active' : ''}" 
                data-year="${year}">
            ${year} (${timelineData.years[year].event_count})
        </button>
    `).join('');
    
    yearNav.querySelectorAll('.year-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedYear = btn.dataset.year;
            renderYearNavigation();
            renderEvents();
            const yearSection = document.querySelector(`[data-year-section="${selectedYear}"]`);
            if (yearSection) yearSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function renderInitialView() {
    if (!timelineData) return;
    renderCategoryFilters();
    renderEvents();
}

function renderCategoryFilters() {
    if (!timelineData || !timelineData.all_categories.length) return;
    
    const filterContainer = document.getElementById('category-filters');
    const categories = timelineData.all_categories;
    const counts = timelineData.category_counts || {};
    
    filterContainer.innerHTML = categories.map(category => {
        const count = counts[category] || 0;
        return `
            <button class="category-tag" data-category="${category}">
                ${category.replace(/_/g, ' ')} ${count > 0 ? `(${count})` : ''}
            </button>
        `;
    }).join('');
    
    filterContainer.querySelectorAll('.category-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const category = tag.dataset.category;
            if (selectedCategories.has(category)) {
                selectedCategories.delete(category);
                tag.classList.remove('active');
            } else {
                selectedCategories.add(category);
                tag.classList.add('active');
            }
            renderEvents();
        });
    });
}

function renderEvents() {
    const container = document.getElementById('timeline-container');
    const noResults = document.getElementById('no-results');
    
    const filteredEvents = getFilteredEvents();
    
    if (filteredEvents.length === 0) {
        container.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }
    
    noResults.classList.add('hidden');
    
    if (currentView === 'all') {
        renderAllEvents(filteredEvents);
    } else {
        renderTimelineEvents(filteredEvents);
    }
}

function renderAllEvents(events) {
    const container = document.getElementById('timeline-container');
    
    const eventsByYear = {};
    events.forEach(event => {
        if (!eventsByYear[event.year]) eventsByYear[event.year] = [];
        eventsByYear[event.year].push(event);
    });
    
    const years = Object.keys(eventsByYear).sort((a, b) => b - a);
    
    container.innerHTML = years.map(year => `
        <div class="year-section" data-year-section="${year}">
            <div class="year-header">
                <h2>${year}</h2>
                <div class="year-divider"></div>
                <span class="event-count">${eventsByYear[year].length} events</span>
            </div>
            <div class="events-grid">
                ${eventsByYear[year].map(event => renderEventCard(event)).join('')}
            </div>
        </div>
    `).join('');
    
    attachEventCardHandlers();
}

function renderTimelineEvents(events) {
    const container = document.getElementById('timeline-container');
    const yearEvents = selectedYear ? events.filter(e => e.year == selectedYear) : events;
    
    if (yearEvents.length === 0) {
        container.innerHTML = `
            <div class="year-section">
                <div class="no-results">
                    <div class="no-results-content">
                        <h3>No events found for ${selectedYear}</h3>
                        <p>Try selecting a different year</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="year-section" data-year-section="${selectedYear}">
            <div class="year-header">
                <h2>${selectedYear}</h2>
                <div class="year-divider"></div>
                <span class="event-count">${yearEvents.length} events</span>
            </div>
            <div class="events-grid">
                ${yearEvents.map(event => renderEventCard(event)).join('')}
            </div>
        </div>
    `;
    
    attachEventCardHandlers();
}

function renderEventCard(event) {
    const formattedDate = formatDate(event.date);
    const imagePath = event.has_image 
        ? `images/KalkiMaaNoorAnantaLife-${event.year}/${event.image}`
        : '';
    
    // Enhanced display with importance indicator
    const importanceClass = event.importance >= 15 ? 'high-importance' : 
                           event.importance >= 10 ? 'medium-importance' : '';
    
    const sentimentIcon = event.sentiment === 'positive' ? '✨' : 
                         event.sentiment === 'concerning' ? '⚠️' : '';
    
    // Show categories and themes
    const displayTags = [...event.categories, ...event.themes].slice(0, 4);
    
    return `
        <div class="event-card ${importanceClass}" data-event-id="${event.id}">
            ${event.has_image ? `
                <img src="${imagePath}" 
                     alt="Event ${event.date}" 
                     class="event-image"
                     onerror="this.style.display='none'">
            ` : ''}
            <div class="event-content">
                <div class="event-date">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                    </svg>
                    ${formattedDate}
                    ${sentimentIcon}
                </div>
                <p class="event-description">${event.description || 'View details...'}</p>
                ${displayTags.length > 0 ? `
                    <div class="event-keywords">
                        ${displayTags.map(tag => `<span class="keyword-badge">${tag.replace(/_/g, ' ')}</span>`).join('')}
                    </div>
                ` : ''}
                ${event.urls && event.urls.length > 0 ? `
                    <div class="event-urls">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                        </svg>
                        ${event.urls[0].label}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function attachEventCardHandlers() {
    document.querySelectorAll('.event-card').forEach(card => {
        card.addEventListener('click', () => {
            const eventId = card.dataset.eventId;
            const event = findEventById(eventId);
            if (event) showEventModal(event);
        });
    });
}

function getFilteredEvents() {
    if (!timelineData) return [];
    
    let events = [...timelineData.all_events];
    
    if (selectedCategories.size > 0) {
        events = events.filter(event => 
            event.categories.some(cat => selectedCategories.has(cat)) ||
            event.themes.some(theme => selectedCategories.has(theme))
        );
    }
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        events = events.filter(event => 
            event.description.toLowerCase().includes(query) ||
            event.keywords.some(kw => kw.toLowerCase().includes(query)) ||
            event.categories.some(cat => cat.toLowerCase().includes(query)) ||
            event.date.includes(query)
        );
    }
    
    return events;
}

function handleSearch(e) {
    searchQuery = e.target.value.trim();
    renderEvents();
}

function toggleFilterPanel() {
    const panel = document.getElementById('filter-panel');
    panel.classList.toggle('hidden');
}

function clearFilters() {
    selectedCategories.clear();
    selectedThemes.clear();
    document.querySelectorAll('.category-tag').forEach(tag => tag.classList.remove('active'));
    renderEvents();
}

function showEventModal(event) {
    const modal = document.getElementById('event-modal');
    const modalBody = document.getElementById('modal-body');
    
    const formattedDate = formatDate(event.date);
    const imagePath = event.has_image 
        ? `images/KalkiMaaNoorAnantaLife-${event.year}/${event.image}`
        : '';
    
    const importanceBadge = event.importance >= 15 ? '⭐⭐⭐ High Significance' :
                           event.importance >= 10 ? '⭐⭐ Significant' :
                           event.importance >= 5 ? '⭐ Notable' : '';
    
    modalBody.innerHTML = `
        ${event.has_image ? `
            <img src="${imagePath}" 
                 alt="Event ${event.date}" 
                 class="modal-image"
                 onerror="this.style.display='none'">
        ` : ''}
        <div class="modal-date">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
            </svg>
            ${formattedDate}
            ${importanceBadge ? `<span style="margin-left: 1rem; opacity: 0.8;">${importanceBadge}</span>` : ''}
        </div>
        <div class="modal-description">${event.description}</div>
        
        ${event.categories.length > 0 ? `
            <div style="margin-top: 1.5rem;">
                <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; opacity: 0.7;">Categories</h4>
                <div class="modal-keywords">
                    ${event.categories.map(cat => `<span class="keyword-badge">${cat.replace(/_/g, ' ')}</span>`).join('')}
                </div>
            </div>
        ` : ''}
        
        ${event.themes.length > 0 ? `
            <div style="margin-top: 1rem;">
                <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; opacity: 0.7;">Themes</h4>
                <div class="modal-keywords">
                    ${event.themes.map(theme => `<span class="keyword-badge" style="background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white;">${theme}</span>`).join('')}
                </div>
            </div>
        ` : ''}
        
        ${event.urls && event.urls.length > 0 ? `
            <div style="margin-top: 1.5rem;">
                <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem; opacity: 0.7;">References</h4>
                ${event.urls.map(url => `
                    <a href="${url.url}" target="_blank" rel="noopener noreferrer" 
                       style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; 
                              background: #F5F5F4; border-radius: 0.5rem; text-decoration: none; 
                              color: #8B5CF6; font-weight: 500; margin-bottom: 0.5rem;">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                        </svg>
                        ${url.label}
                    </a>
                `).join('')}
            </div>
        ` : ''}
        
        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #E7E5E4; 
                    font-size: 0.875rem; color: #78716C;">
            ${event.sentiment === 'positive' ? '✨ Positive tone' : 
              event.sentiment === 'concerning' ? '⚠️ Important warning' : 
              '📝 Informative'}
        </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('event-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function findEventById(eventId) {
    if (!timelineData) return null;
    return timelineData.all_events.find(e => e.id === eventId);
}
