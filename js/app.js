// Kalki Maa Noor Ananta - Narrative Timeline Application
import Router from './router.js';
import DataManager from './data-manager.js';
import { renderLanding } from './views/landing.js';
import { renderChapters } from './views/chapters.js';
import { renderChapterDetail } from './views/chapter-detail.js';
import { renderEventDetail } from './views/event-detail.js';
import { renderProphecies } from './views/prophecies.js';
import { renderCosmic } from './views/cosmic.js';
import { renderExplore } from './views/explore.js';

const app = document.getElementById('app');
const loadingScreen = document.getElementById('loading-screen');

async function init() {
    try {
        await DataManager.load();
        hideLoading();
        setupRoutes();
        Router.init();
    } catch (error) {
        console.error('Failed to initialize:', error);
        showError('Failed to load data. Please refresh the page.');
    }
}

function hideLoading() {
    if (loadingScreen) {
        setTimeout(() => loadingScreen.classList.add('hidden'), 300);
    }
}

function showError(message) {
    if (loadingScreen) {
        loadingScreen.querySelector('p').textContent = message;
    }
}

function setupRoutes() {
    Router.add('/', () => {
        app.className = 'view-landing';
        renderLanding(app);
    });

    Router.add('/chapters', () => {
        app.className = 'view-chapters';
        renderChapters(app);
    });

    Router.add('/chapter/:year', ({ year }) => {
        app.className = 'view-chapter-detail';
        renderChapterDetail(app, { year });
        window.scrollTo(0, 0);
    });

    Router.add('/event/:id', ({ id }) => {
        app.className = 'view-event-detail';
        renderEventDetail(app, { id });
    });

    Router.add('/prophecies', () => {
        app.className = 'view-prophecies';
        renderProphecies(app);
    });

    Router.add('/cosmic', () => {
        app.className = 'view-cosmic';
        renderCosmic(app);
    });

    Router.add('/explore', () => {
        app.className = 'view-explore';
        renderExplore(app);
    });
}

document.addEventListener('DOMContentLoaded', init);
