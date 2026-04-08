import DataManager from '../data-manager.js';
import Router from '../router.js';

export function renderProphecies(container) {
    const prophecies = DataManager.getProphecies();
    const site = DataManager.getSiteConfig();

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
                    <a href="#/chapters">Chapters</a>
                    <a href="#/cosmic">Cosmic Framework</a>
                    <a href="#/explore">Explore</a>
                </div>
            </div>
        </nav>

        <header class="page-header prophecies-header">
            <div class="container">
                <h1>Decoded Prophecies</h1>
                <p class="page-subtitle">Messages that foretold the future — timestamped, decoded, and verified against world events</p>
            </div>
        </header>

        <main class="prophecies-page">
            <div class="container narrow">
                ${prophecies.map((prophecy, i) => {
                    const predEvent = DataManager.getEventById(prophecy.prediction_event);
                    const predImage = predEvent?.has_image ? DataManager.getImagePath(predEvent) : '';

                    return `
                        <div class="prophecy-card">
                            <div class="prophecy-number">${i + 1}</div>
                            <h2 class="prophecy-title">${prophecy.title}</h2>

                            <div class="prophecy-flow">
                                <div class="prophecy-prediction">
                                    <div class="prophecy-label">The Prediction</div>
                                    ${predEvent ? `
                                        <div class="prophecy-event-card" data-event-id="${predEvent.id}">
                                            ${predImage ? `<img src="${predImage}" alt="Prediction" class="prophecy-image" loading="lazy" onerror="this.style.display='none'">` : ''}
                                            <div class="prophecy-event-info">
                                                <span class="prophecy-date">${DataManager.formatDate(predEvent.date)}</span>
                                                <p>${predEvent.description}</p>
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>

                                <div class="prophecy-decode">
                                    <div class="prophecy-label">The Decode</div>
                                    <div class="decode-box">
                                        <p>${prophecy.decode_explanation}</p>
                                    </div>
                                </div>

                                <div class="prophecy-arrow">
                                    <div class="arrow-line"></div>
                                    <div class="arrow-gap">${prophecy.gap_days} days</div>
                                    <div class="arrow-line"></div>
                                </div>

                                <div class="prophecy-fulfillment">
                                    <div class="prophecy-label">The Fulfillment</div>
                                    <div class="fulfillment-box">
                                        <span class="fulfillment-date">${prophecy.fulfillment_date}</span>
                                        <p>${prophecy.fulfillment_description}</p>
                                    </div>
                                </div>

                                <div class="prophecy-verification">
                                    <p>${prophecy.verification}</p>
                                </div>
                            </div>

                            ${prophecy.supporting_events?.length > 0 ? `
                                <div class="supporting-events">
                                    <h4>Supporting Messages</h4>
                                    <div class="supporting-list">
                                        ${prophecy.supporting_events.map(seId => {
                                            const se = DataManager.getEventById(seId);
                                            if (!se) return '';
                                            return `
                                                <div class="supporting-item" data-event-id="${se.id}">
                                                    <span class="supporting-date">${DataManager.formatDate(se.date)}</span>
                                                    <p>${truncate(se.description, 120)}</p>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        </main>

        <footer class="site-footer">
            <div class="container">
                <p class="footer-tagline">${site.tagline || ''}</p>
            </div>
        </footer>
    `;

    // Click handlers for events
    container.querySelectorAll('[data-event-id]').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
            Router.navigate(`/event/${el.dataset.eventId}`);
        });
    });

    window.scrollTo(0, 0);
}

function truncate(text, maxLen) {
    if (!text || text.length <= maxLen) return text || '';
    return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '...';
}
