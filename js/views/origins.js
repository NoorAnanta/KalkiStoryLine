import DataManager from '../data-manager.js';
import Router from '../router.js';

export function renderOrigins(container) {
    const origins = DataManager.getOrigins();
    const site = DataManager.getSiteConfig();

    if (!origins) {
        container.innerHTML = '<div class="container" style="padding:4rem 1rem;text-align:center"><h2>Origins content not available</h2></div>';
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
                    <a href="#/cosmic">Cosmic Framework</a>
                </div>
            </div>
        </nav>

        <header class="page-header origins-header">
            <div class="container">
                <h1>${origins.title}</h1>
                <p class="page-subtitle">${origins.subtitle}</p>
            </div>
        </header>

        <main class="origins-page">
            <div class="container narrow">
                <div class="origins-intro">
                    <p>${origins.intro}</p>
                    <p class="origins-disclaimer">${origins.disclaimer}</p>
                </div>

                <div class="origins-timeline">
                    ${origins.timeline.map((event, i) => `
                        <div class="origin-event">
                            <div class="origin-year-marker">
                                <div class="origin-dot"></div>
                                <span class="origin-year">${event.year}</span>
                            </div>
                            <div class="origin-content">
                                <h3 class="origin-title">${event.title}</h3>
                                <p class="origin-description">${event.description}</p>
                                ${event.video_id ? `
                                    <div class="origin-video">
                                        <div class="video-embed">
                                            <iframe
                                                src="https://www.youtube.com/embed/${event.video_id}"
                                                title="${event.title}"
                                                frameborder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowfullscreen
                                                loading="lazy">
                                            </iframe>
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="origins-cta">
                    <p>The documented timeline of coded messages begins in 2016.</p>
                    <a href="#/chapters" class="btn-cta">Continue to the Seven Chapters</a>
                </div>
            </div>
        </main>

        <footer class="site-footer">
            <div class="container">
                <p class="footer-tagline">${site.tagline || ''}</p>
            </div>
        </footer>
    `;

    window.scrollTo(0, 0);
}
