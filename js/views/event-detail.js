import DataManager from '../data-manager.js';
import Router from '../router.js';

export function renderEventDetail(container, { id }) {
    const event = DataManager.getEventById(id);
    if (!event) {
        container.innerHTML = `
            <div class="container" style="padding: 4rem 1rem; text-align: center;">
                <h2>Event not found</h2>
                <p>The event "${id}" could not be found.</p>
                <a href="#/chapters" class="btn-outline" style="margin-top: 1rem; display: inline-block;">Back to Chapters</a>
            </div>
        `;
        return;
    }

    const year = String(event.year);
    const ch = DataManager.getChapterConfig(year);
    const { prev, next } = DataManager.getAdjacentEvents(id, year);
    const imagePath = event.has_image ? DataManager.getImagePath(event) : '';

    const importanceBadge = event.importance >= 15 ? 'High Significance' :
                           event.importance >= 10 ? 'Significant' :
                           event.importance >= 5 ? 'Notable' : '';

    // Check if this event is a prophecy prediction
    const prophecies = DataManager.getProphecies();
    const relatedProphecy = prophecies.find(p =>
        p.prediction_event === id || p.supporting_events?.includes(id)
    );

    container.innerHTML = `
        <nav class="page-nav">
            <div class="container">
                <a href="#/chapter/${year}" class="nav-back">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M13 16l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    ${ch?.title || year}
                </a>
                <div class="nav-links">
                    ${prev ? `<a href="#/event/${prev.id}">← Previous</a>` : ''}
                    ${next ? `<a href="#/event/${next.id}">Next →</a>` : ''}
                </div>
            </div>
        </nav>

        <article class="event-page">
            <div class="container narrow">
                <div class="event-page-header">
                    <div class="event-page-date-row">
                        <span class="event-page-chapter" style="color: ${ch?.color || '#8B5CF6'}">
                            Chapter: ${ch?.title || year}
                        </span>
                        <span class="event-page-date">${DataManager.formatDate(event.date)}</span>
                    </div>
                    ${importanceBadge ? `<div class="event-importance-badge">${importanceBadge}</div>` : ''}
                </div>

                ${event.has_image ? `
                    <div class="event-page-image">
                        <img src="${imagePath}" alt="Message from ${event.date}" onerror="this.parentElement.style.display='none'">
                    </div>
                ` : ''}

                <div class="event-page-body">
                    <div class="event-page-description">${event.description}</div>

                    ${relatedProphecy ? `
                        <div class="prophecy-decode-box">
                            <h3 class="decode-title">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 2L2 10l8 8 8-8-8-8z" stroke="currentColor" stroke-width="2" fill="none"/>
                                    <circle cx="10" cy="10" r="2" fill="currentColor"/>
                                </svg>
                                Decoded Prophecy: ${relatedProphecy.title}
                            </h3>
                            <div class="decode-content">
                                <p class="decode-explanation">${relatedProphecy.decode_explanation}</p>
                                <div class="decode-fulfillment">
                                    <div class="decode-arrow">
                                        <span class="decode-gap">${relatedProphecy.gap_days} days later</span>
                                    </div>
                                    <div class="decode-result">
                                        <strong>${relatedProphecy.fulfillment_date}:</strong>
                                        ${relatedProphecy.fulfillment_description}
                                    </div>
                                </div>
                                <p class="decode-verification">${relatedProphecy.verification}</p>
                            </div>
                        </div>
                    ` : ''}

                    ${event.categories.length > 0 ? `
                        <div class="event-page-section">
                            <h4>Categories</h4>
                            <div class="tag-list">
                                ${event.categories.map(c => `<span class="mini-tag">${c.replace(/_/g, ' ')}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${event.themes.length > 0 ? `
                        <div class="event-page-section">
                            <h4>Themes</h4>
                            <div class="tag-list">
                                ${event.themes.map(t => `<span class="mini-tag theme">${t}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${event.urls?.length > 0 ? `
                        <div class="event-page-section">
                            <h4>References</h4>
                            <div class="reference-links">
                                ${event.urls.map(url => `
                                    <a href="${url.url}" target="_blank" rel="noopener noreferrer" class="ref-link-card">
                                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                                        </svg>
                                        ${url.label}
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <div class="event-page-footer">
                        <span class="sentiment-indicator">
                            ${event.sentiment === 'positive' ? '✨ Positive tone' :
                              event.sentiment === 'concerning' ? '⚠️ Important warning' :
                              '📝 Informative'}
                        </span>
                        <span class="event-id">ID: ${event.id}</span>
                    </div>
                </div>
            </div>
        </article>

        <nav class="event-nav-bottom">
            <div class="container narrow">
                <div class="event-nav-links">
                    ${prev ? `
                        <a href="#/event/${prev.id}" class="event-nav-prev">
                            <span class="nav-dir">← Previous Message</span>
                            <span class="nav-event-date">${DataManager.formatDate(prev.date)}</span>
                        </a>
                    ` : '<div></div>'}
                    ${next ? `
                        <a href="#/event/${next.id}" class="event-nav-next">
                            <span class="nav-dir">Next Message →</span>
                            <span class="nav-event-date">${DataManager.formatDate(next.date)}</span>
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

    // Scroll to top
    window.scrollTo(0, 0);
}
