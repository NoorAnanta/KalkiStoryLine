import DataManager from '../data-manager.js';
import Router from '../router.js';

export function renderLanding(container) {
    const site = DataManager.getSiteConfig();
    const proofPoints = DataManager.getProofPoints();
    const years = DataManager.getChapterYears();

    container.innerHTML = `
        <section class="hero">
            <div class="hero-bg"></div>
            <div class="hero-content">
                <div class="hero-badge">The Chronicle of the Kalki Avatar</div>
                <h1 class="hero-title">${site.title || 'Kalki Maa Noor Ananta'}</h1>
                <p class="hero-subtitle">${site.subtitle || ''}</p>
                <p class="hero-description">${site.hero_description || ''}</p>
                <div class="hero-actions">
                    <button class="btn-cta" id="begin-story">
                        Begin the Story
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7 4l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="btn-cta-secondary" id="view-prophecies">
                        View Decoded Prophecies
                    </button>
                </div>
            </div>
        </section>

        <section class="proof-section">
            <div class="container">
                <div class="proof-grid">
                    ${proofPoints.map(p => `
                        <div class="proof-card" data-link="${p.link_to || ''}">
                            <div class="proof-number">${p.number}</div>
                            <div class="proof-unit">${p.unit}</div>
                            <h3 class="proof-title">${p.title}</h3>
                            <p class="proof-desc">${p.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <section class="chapters-ribbon">
            <div class="container">
                <h2 class="section-heading">The Seven Chapters</h2>
                <p class="section-subheading">Each year a chapter in the cosmic narrative</p>
                <div class="chapter-timeline">
                    <div class="chapter-timeline-line"></div>
                    ${years.map(year => {
                        const ch = DataManager.getChapterConfig(year);
                        const events = DataManager.getEventsForYear(year);
                        return `
                            <div class="chapter-node" data-year="${year}">
                                <div class="chapter-node-dot" style="background: ${ch?.color || '#8B5CF6'}"></div>
                                <div class="chapter-node-year">${year}</div>
                                <div class="chapter-node-title">${ch?.title || 'Chapter'}</div>
                                <div class="chapter-node-count">${events.length} messages</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </section>

        <section class="purpose-section">
            <div class="container">
                <div class="purpose-content">
                    <h2 class="section-heading">The Divine Purpose</h2>
                    <p class="purpose-text">${site.hero_secondary || ''}</p>
                    <div class="purpose-actions">
                        <button class="btn-outline" id="view-cosmic">Understand the Cosmic Framework</button>
                        <button class="btn-outline" id="explore-all">Explore All Events</button>
                    </div>
                </div>
            </div>
        </section>

        <footer class="site-footer">
            <div class="container">
                <p class="footer-tagline">${site.tagline || ''}</p>
                <p class="footer-note">An Archive of Divine Messages and Life Events</p>
            </div>
        </footer>
    `;

    // Event listeners
    container.querySelector('#begin-story').addEventListener('click', () => {
        Router.navigate(`/chapters`);
    });
    container.querySelector('#view-prophecies').addEventListener('click', () => {
        Router.navigate('/prophecies');
    });
    container.querySelector('#view-cosmic')?.addEventListener('click', () => {
        Router.navigate('/cosmic');
    });
    container.querySelector('#explore-all')?.addEventListener('click', () => {
        Router.navigate('/explore');
    });

    // Chapter node clicks
    container.querySelectorAll('.chapter-node').forEach(node => {
        node.addEventListener('click', () => {
            Router.navigate(`/chapter/${node.dataset.year}`);
        });
    });

    // Proof card clicks
    container.querySelectorAll('.proof-card').forEach(card => {
        if (card.dataset.link) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                Router.navigate('/prophecies');
            });
        }
    });
}
