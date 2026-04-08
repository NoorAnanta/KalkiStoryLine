import DataManager from '../data-manager.js';
import Router from '../router.js';

const EVENTS_PER_PAGE = 20;

export function renderChapterDetail(container, { year }) {
    const ch = DataManager.getChapterConfig(year);
    const events = DataManager.getEventsForYear(year);
    const years = DataManager.getChapterYears();
    const yearIdx = years.indexOf(year);
    const prevYear = yearIdx > 0 ? years[yearIdx - 1] : null;
    const nextYear = yearIdx < years.length - 1 ? years[yearIdx + 1] : null;
    const chapterNum = yearIdx + 1;

    // Separate highlighted vs regular events
    const highlightedIds = new Set(ch?.highlighted_events || []);
    const highlighted = events.filter(e => highlightedIds.has(e.id));
    const allEventsChronological = [...events].sort((a, b) => a.date.localeCompare(b.date));

    // Separate reference-only from narrative events
    const narrativeEvents = allEventsChronological.filter(e => e.description && e.description.length > 10);
    const referenceEvents = allEventsChronological.filter(e => !e.description || e.description.length <= 10);

    let visibleCount = EVENTS_PER_PAGE;

    container.innerHTML = `
        <nav class="page-nav">
            <div class="container">
                <a href="#/chapters" class="nav-back">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M13 16l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    All Chapters
                </a>
                <div class="nav-links">
                    ${prevYear ? `<a href="#/chapter/${prevYear}">← ${prevYear}</a>` : ''}
                    ${nextYear ? `<a href="#/chapter/${nextYear}">${nextYear} →</a>` : ''}
                </div>
            </div>
        </nav>

        <header class="chapter-header" style="--chapter-color: ${ch?.color || '#8B5CF6'}">
            <div class="chapter-header-bg"></div>
            <div class="container chapter-header-content">
                <span class="chapter-label">Chapter ${chapterNum}</span>
                <div class="chapter-year-large">${year}</div>
                <h1 class="chapter-title">${ch?.title || year}</h1>
                <p class="chapter-subtitle">${ch?.subtitle || ''}</p>
                <div class="chapter-stats">
                    <span>${events.length} messages</span>
                    <span class="dot-sep"></span>
                    <span>${ch?.key_themes?.join(', ') || ''}</span>
                </div>
            </div>
        </header>

        <section class="chapter-narrative-section">
            <div class="container narrow">
                <p class="chapter-narrative-text">${ch?.narrative || ''}</p>
            </div>
        </section>

        ${highlighted.length > 0 ? `
            <section class="key-moments-section">
                <div class="container">
                    <h2 class="section-heading">Key Moments</h2>
                    <div class="key-moments-grid">
                        ${highlighted.map(event => renderHighlightCard(event)).join('')}
                    </div>
                </div>
            </section>
        ` : ''}

        <section class="chronicle-section">
            <div class="container narrow">
                <h2 class="section-heading">The Full Chronicle</h2>
                <p class="section-subheading">${narrativeEvents.length} documented messages from ${year}</p>
                <div class="story-timeline" id="story-timeline">
                    ${renderStoryBeats(narrativeEvents.slice(0, visibleCount))}
                </div>
                ${narrativeEvents.length > EVENTS_PER_PAGE ? `
                    <div class="load-more-container" id="load-more-container">
                        <button class="btn-load-more" id="load-more-btn">
                            Load More Messages (${Math.max(0, narrativeEvents.length - EVENTS_PER_PAGE)} remaining)
                        </button>
                    </div>
                ` : ''}
            </div>
        </section>

        ${referenceEvents.length > 0 ? `
            <section class="references-section">
                <div class="container narrow">
                    <h2 class="section-heading">Reference Archive</h2>
                    <p class="section-subheading">${referenceEvents.length} archived posts with external links</p>
                    <div class="reference-list">
                        ${referenceEvents.slice(0, 50).map(event => `
                            <div class="reference-item" data-event-id="${event.id}">
                                <span class="ref-date">${DataManager.formatDate(event.date)}</span>
                                ${event.urls?.length > 0 ? `
                                    <a href="${event.urls[0].url}" target="_blank" rel="noopener" class="ref-link">${event.urls[0].label}</a>
                                ` : `<span class="ref-text">${event.description || 'Archived post'}</span>`}
                            </div>
                        `).join('')}
                        ${referenceEvents.length > 50 ? `<p class="ref-more">+ ${referenceEvents.length - 50} more archived posts</p>` : ''}
                    </div>
                </div>
            </section>
        ` : ''}

        <nav class="chapter-nav-bottom">
            <div class="container">
                <div class="chapter-nav-links">
                    ${prevYear ? `
                        <a href="#/chapter/${prevYear}" class="chapter-nav-prev">
                            <span class="nav-dir">← Previous Chapter</span>
                            <span class="nav-chapter-name">${DataManager.getChapterConfig(prevYear)?.title || prevYear}</span>
                        </a>
                    ` : '<div></div>'}
                    ${nextYear ? `
                        <a href="#/chapter/${nextYear}" class="chapter-nav-next">
                            <span class="nav-dir">Next Chapter →</span>
                            <span class="nav-chapter-name">${DataManager.getChapterConfig(nextYear)?.title || nextYear}</span>
                        </a>
                    ` : '<div></div>'}
                </div>
            </div>
        </nav>

        <footer class="site-footer">
            <div class="container">
                <p class="footer-tagline">A Timeline for the Next 8000 Years</p>
            </div>
        </footer>
    `;

    // Load more button
    const loadMoreBtn = container.querySelector('#load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleCount += EVENTS_PER_PAGE;
            const timeline = container.querySelector('#story-timeline');
            timeline.innerHTML = renderStoryBeats(narrativeEvents.slice(0, visibleCount));
            attachEventClicks(container);

            if (visibleCount >= narrativeEvents.length) {
                container.querySelector('#load-more-container').style.display = 'none';
            } else {
                loadMoreBtn.textContent = `Load More Messages (${narrativeEvents.length - visibleCount} remaining)`;
            }
        });
    }

    attachEventClicks(container);
}

function renderStoryBeats(events) {
    return events.map((event, i) => {
        const isLeft = i % 2 === 0;
        const imagePath = event.has_image ? DataManager.getImagePath(event) : '';
        const importanceClass = event.importance >= 15 ? 'high-importance' :
                               event.importance >= 10 ? 'medium-importance' : '';

        return `
            <div class="story-beat ${isLeft ? 'left' : 'right'} ${importanceClass}" data-event-id="${event.id}">
                <div class="story-beat-dot"></div>
                <div class="story-beat-card">
                    ${event.has_image ? `
                        <div class="story-beat-image">
                            <img src="${imagePath}" alt="Message from ${event.date}" loading="lazy" onerror="this.parentElement.style.display='none'">
                        </div>
                    ` : ''}
                    <div class="story-beat-content">
                        <div class="story-beat-date">${DataManager.formatDate(event.date)}</div>
                        <p class="story-beat-text">${event.description}</p>
                        ${event.categories.length > 0 ? `
                            <div class="story-beat-tags">
                                ${event.categories.slice(0, 3).map(c => `<span class="mini-tag">${c.replace(/_/g, ' ')}</span>`).join('')}
                            </div>
                        ` : ''}
                        ${event.importance >= 15 ? '<div class="importance-badge">High Significance</div>' : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderHighlightCard(event) {
    const imagePath = event.has_image ? DataManager.getImagePath(event) : '';
    return `
        <div class="highlight-card" data-event-id="${event.id}">
            ${event.has_image ? `
                <img src="${imagePath}" alt="Key moment: ${event.date}" class="highlight-image" loading="lazy" onerror="this.style.display='none'">
            ` : ''}
            <div class="highlight-content">
                <div class="highlight-date">${DataManager.formatDate(event.date)}</div>
                <p class="highlight-text">${event.description}</p>
                <div class="highlight-tags">
                    ${event.categories.slice(0, 4).map(c => `<span class="mini-tag">${c.replace(/_/g, ' ')}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

function attachEventClicks(container) {
    container.querySelectorAll('[data-event-id]').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            Router.navigate(`/event/${el.dataset.eventId}`);
        });
    });
}
