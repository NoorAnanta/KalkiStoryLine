import DataManager from '../data-manager.js';
import Router from '../router.js';

export function renderChapters(container) {
    const years = DataManager.getChapterYears();
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
                    <a href="#/prophecies">Prophecies</a>
                    <a href="#/cosmic">Cosmic Framework</a>
                    <a href="#/explore">Explore</a>
                </div>
            </div>
        </nav>

        <header class="page-header">
            <div class="container">
                <h1>The Seven Chapters</h1>
                <p class="page-subtitle">The story of Kalki's divine mission, told year by year</p>
            </div>
        </header>

        <main class="chapters-page">
            <div class="container">
                <div class="chapters-timeline-vertical">
                    ${years.map((year, i) => {
                        const ch = DataManager.getChapterConfig(year);
                        const events = DataManager.getEventsForYear(year);
                        const isLeft = i % 2 === 0;

                        return `
                            <div class="chapter-card-wrapper ${isLeft ? 'left' : 'right'}" data-year="${year}">
                                <div class="chapter-timeline-dot" style="background: ${ch?.color || '#8B5CF6'}">
                                    <span class="chapter-timeline-year">${year}</span>
                                </div>
                                <div class="chapter-card" style="border-left: 4px solid ${ch?.color || '#8B5CF6'}">
                                    <div class="chapter-card-header">
                                        <span class="chapter-number">Chapter ${i + 1}</span>
                                        <h2 class="chapter-card-title">${ch?.title || year}</h2>
                                        <p class="chapter-card-subtitle">${ch?.subtitle || ''}</p>
                                    </div>
                                    <p class="chapter-card-narrative">${truncate(ch?.narrative || '', 200)}</p>
                                    <div class="chapter-card-meta">
                                        <span class="chapter-event-count">${events.length} messages</span>
                                        ${ch?.key_themes ? `
                                            <div class="chapter-themes">
                                                ${ch.key_themes.slice(0, 3).map(t => `<span class="theme-tag">${t}</span>`).join('')}
                                            </div>
                                        ` : ''}
                                    </div>
                                    <button class="btn-read-chapter">Read Chapter</button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </main>

        <footer class="site-footer">
            <div class="container">
                <p class="footer-tagline">${site.tagline || ''}</p>
            </div>
        </footer>
    `;

    container.querySelectorAll('.chapter-card-wrapper').forEach(wrapper => {
        const year = wrapper.dataset.year;
        wrapper.querySelector('.btn-read-chapter').addEventListener('click', () => {
            Router.navigate(`/chapter/${year}`);
        });
        wrapper.querySelector('.chapter-card').addEventListener('click', (e) => {
            if (e.target.closest('.btn-read-chapter')) return;
            Router.navigate(`/chapter/${year}`);
        });
    });
}

function truncate(text, maxLen) {
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '...';
}
