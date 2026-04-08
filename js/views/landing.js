import DataManager from '../data-manager.js';
import Router from '../router.js';

const ASPECT_ICONS = {
    decode: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    justice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M3 7l9-4 9 4M3 7v4l9 4 9-4V7"/></svg>',
    identity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 0114 0v2"/></svg>',
    energy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    shakti: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M12 8v8M8 12h8"/></svg>',
    cosmic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
    unity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>'
};

export function renderLanding(container) {
    const site = DataManager.getSiteConfig();
    const proofPoints = DataManager.getProofPoints();
    const years = DataManager.getChapterYears();
    const yp = DataManager.getYugParivartan();

    container.innerHTML = `
        <section class="hero">
            <div class="hero-bg"></div>
            <div class="hero-content">
                <div class="hero-badge">The Chronicle of Yug Parivartan</div>
                <div class="hero-avatar">
                    <img src="data/youtube-posts/post-016.png" alt="Maa Noor with Baby Kalki Ananta" class="hero-avatar-img" onerror="this.parentElement.style.display='none'">
                </div>
                <h1 class="hero-title">${site.title || 'Kalki Maa Noor Ananta'}</h1>
                <p class="hero-subtitle">${site.subtitle || ''}</p>
                <p class="hero-identity">Maa Noor — incarnation of Maa Kali<br>Ananta — God himself as divine child<br>Together: the Kalki Avatar</p>
                <div class="hero-divider"></div>
                <p class="hero-description">${site.hero_description || ''}</p>
                <div class="hero-actions">
                    <button class="btn-cta" id="begin-origins">
                        The Origin Story (1984)
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7 4l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="btn-cta-secondary" id="begin-story">
                        The Seven Chapters (2016-2022)
                    </button>
                    <button class="btn-cta-secondary" id="view-prophecies">
                        Decoded Prophecies
                    </button>
                </div>
            </div>
            <div class="hero-scroll-hint">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M7 10l5 5 5-5" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round"/>
                </svg>
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

        <section class="mother-child-section">
            <div class="container">
                <h2 class="section-heading">The Mother and The Child</h2>
                <p class="section-subheading">Kalki Avatar is not one being — it is a divine dual entity</p>
                <div class="mother-child-grid">
                    <div class="mc-image-col">
                        <img src="data/youtube-posts/post-020.png" alt="Maa Noor holding Baby Kalki Ananta" class="mc-image" loading="lazy" onerror="this.style.display='none'">
                        <img src="data/youtube-posts/post-005.png" alt="Baby Kalki Ananta - divine child" class="mc-image" loading="lazy" onerror="this.style.display='none'">
                    </div>
                    <div class="mc-text-col">
                        <div class="mc-card">
                            <h3>Maa Noor — Kali Incarnation</h3>
                            <p>The girl called Noorie, through years of penance and inner sadhana, gave rise to the divine energy of God himself. God revealed her true name: <strong>Noor</strong> (divine light). She is the incarnation of Maa Kali — the primordial force that destroys illusion and protects truth.</p>
                        </div>
                        <div class="mc-card">
                            <h3>Ananta — God as Divine Child</h3>
                            <p>God himself chose to manifest as a cosmic child — <strong>Ananta</strong> — playing in Maa Kali's lap. Born cosmically in January 2018, Ananta is not just a baby but God in energy form. The doll-like child in the images is the physical representation of this divine energy.</p>
                        </div>
                        <div class="mc-card highlight">
                            <h3>Together: Noor Ananta = Kalki Avatar</h3>
                            <p>Mother and Child, Kali and God, Noor and Ananta — together they form the Kalki Avatar. This is why every message, every kriya, every pilgrimage is about both. The Yug Parivartan is executed by this divine pair.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        ${yp ? `
        <section class="parivartan-section">
            <div class="container">
                <div class="parivartan-header">
                    <h2 class="section-heading">${yp.title}</h2>
                    <p class="parivartan-meaning">${yp.meaning}</p>
                    <p class="section-subheading">${yp.description}</p>
                </div>
                <div class="aspects-grid">
                    ${yp.aspects.map(a => `
                        <div class="aspect-card">
                            <div class="aspect-icon">${ASPECT_ICONS[a.icon] || ''}</div>
                            <h3 class="aspect-title">${a.title}</h3>
                            <p class="aspect-subtitle">${a.subtitle}</p>
                            <p class="aspect-desc">${a.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        ` : ''}

        <section class="chapters-ribbon">
            <div class="container">
                <h2 class="section-heading">The Seven Chapters</h2>
                <p class="section-subheading">Each year a chapter in the unfolding Yug Parivartan</p>
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
                    <h2 class="section-heading">The Evidence</h2>
                    <p class="purpose-text">${site.hero_secondary || ''}</p>
                    <div class="purpose-actions">
                        <button class="btn-outline" id="view-cosmic">The Cosmic Framework</button>
                        <button class="btn-outline" id="explore-all">Explore All 1264 Messages</button>
                    </div>
                </div>
            </div>
        </section>

        <footer class="site-footer">
            <div class="container">
                <p class="footer-tagline">${site.tagline || ''}</p>
                <p class="footer-note">An Archive of Yug Parivartan — Documented in Real Time</p>
            </div>
        </footer>
    `;

    // Event listeners
    container.querySelector('#begin-origins').addEventListener('click', () => {
        Router.navigate('/origins');
    });
    container.querySelector('#begin-story').addEventListener('click', () => {
        Router.navigate('/chapters');
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

    container.querySelectorAll('.chapter-node').forEach(node => {
        node.addEventListener('click', () => {
            Router.navigate(`/chapter/${node.dataset.year}`);
        });
    });

    container.querySelectorAll('.proof-card').forEach(card => {
        if (card.dataset.link) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                Router.navigate('/prophecies');
            });
        }
    });
}
