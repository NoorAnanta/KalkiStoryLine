import DataManager from '../data-manager.js';
import Router from '../router.js';

export function renderCosmic(container) {
    const framework = DataManager.getCosmicFramework();
    const site = DataManager.getSiteConfig();

    if (!framework) {
        container.innerHTML = '<div class="container"><p>Cosmic framework data not available.</p></div>';
        return;
    }

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
                    <a href="#/prophecies">Prophecies</a>
                    <a href="#/explore">Explore</a>
                </div>
            </div>
        </nav>

        <header class="page-header cosmic-header">
            <div class="container">
                <h1>The Cosmic Framework</h1>
                <p class="page-subtitle">Understanding the kriyas, frequencies, and cosmic architecture behind the messages</p>
            </div>
        </header>

        <main class="cosmic-page">
            <div class="container narrow">
                <div class="cosmic-intro">
                    <div class="cosmic-hero-images">
                        <img src="data/youtube-posts/post-016.png" alt="Maa Noor with Baby Kalki Ananta" class="cosmic-hero-img" loading="lazy" onerror="this.style.display='none'">
                        <img src="data/youtube-posts/post-002.png" alt="Mother and Child - divine pair" class="cosmic-hero-img" loading="lazy" onerror="this.style.display='none'">
                    </div>
                    <p>${framework.intro}</p>
                </div>

                <div class="cosmic-sections">
                    ${framework.sections.map((section, i) => {
                        const relatedEvents = (section.related_events || [])
                            .map(id => DataManager.getEventById(id))
                            .filter(Boolean);

                        return `
                            <section class="cosmic-section" id="${section.id}">
                                <div class="cosmic-section-number">${String(i + 1).padStart(2, '0')}</div>
                                <h2 class="cosmic-section-title">${section.title}</h2>
                                <div class="cosmic-section-content">
                                    <p>${section.content}</p>
                                </div>
                                ${relatedEvents.length > 0 ? `
                                    <div class="cosmic-related">
                                        <h4>Related Messages</h4>
                                        <div class="cosmic-related-list">
                                            ${relatedEvents.map(event => `
                                                <div class="cosmic-related-item" data-event-id="${event.id}">
                                                    ${event.has_image ? `
                                                        <img src="${DataManager.getImagePath(event)}" alt="" class="cosmic-related-thumb" loading="lazy" onerror="this.style.display='none'">
                                                    ` : ''}
                                                    <div>
                                                        <span class="cosmic-related-date">${DataManager.formatDate(event.date)}</span>
                                                        <p>${truncate(event.description, 100)}</p>
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                            </section>
                        `;
                    }).join('')}
                </div>

                <div class="cosmic-cta">
                    <p>Now that you understand the framework, experience the story.</p>
                    <a href="#/chapters" class="btn-cta">Begin the Chapters</a>
                </div>
            </div>
        </main>

        <footer class="site-footer">
            <div class="container">
                <p class="footer-tagline">${site.tagline || ''}</p>
            </div>
        </footer>
    `;

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
