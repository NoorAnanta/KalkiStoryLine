// Centralized data loading for timeline and narrative config
const DataManager = {
    timelineData: null,
    narrativeConfig: null,
    loading: false,
    loaded: false,
    listeners: [],

    async load() {
        if (this.loaded) return;
        if (this.loading) {
            return new Promise(resolve => this.listeners.push(resolve));
        }
        this.loading = true;

        try {
            const [timelineRes, narrativeRes] = await Promise.all([
                fetch('data/timeline_data.json'),
                fetch('data/narrative_config.json')
            ]);
            this.timelineData = await timelineRes.json();
            this.narrativeConfig = await narrativeRes.json();
            this.loaded = true;
            this.listeners.forEach(fn => fn());
            this.listeners = [];
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    },

    getChapterConfig(year) {
        return this.narrativeConfig?.chapters?.[year] || null;
    },

    getChapterYears() {
        if (!this.timelineData) return [];
        return Object.keys(this.timelineData.years).sort((a, b) => a - b);
    },

    getEventsForYear(year) {
        return this.timelineData?.years?.[year]?.events || [];
    },

    getEventById(id) {
        if (!this.timelineData) return null;
        return this.timelineData.all_events.find(e => e.id === id);
    },

    getAdjacentEvents(eventId, year) {
        const events = this.getEventsForYear(year);
        const idx = events.findIndex(e => e.id === eventId);
        return {
            prev: idx > 0 ? events[idx - 1] : null,
            next: idx < events.length - 1 ? events[idx + 1] : null
        };
    },

    getProphecies() {
        return this.narrativeConfig?.prophecies || [];
    },

    getCosmicFramework() {
        return this.narrativeConfig?.cosmic_framework || null;
    },

    getProofPoints() {
        return this.narrativeConfig?.proof_points || [];
    },

    getSiteConfig() {
        return this.narrativeConfig?.site || {};
    },

    getStats() {
        return this.timelineData?.stats || {};
    },

    getImagePath(event) {
        return `images/KalkiMaaNoorAnantaLife-${event.year}/${event.image}`;
    },

    formatDate(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    searchEvents(query) {
        if (!this.timelineData || !query) return [];
        const q = query.toLowerCase();
        return this.timelineData.all_events.filter(event =>
            event.description?.toLowerCase().includes(q) ||
            event.keywords?.some(kw => kw.toLowerCase().includes(q)) ||
            event.categories?.some(cat => cat.toLowerCase().includes(q)) ||
            event.date?.includes(q)
        );
    },

    filterEvents(categories, searchQuery) {
        if (!this.timelineData) return [];
        let events = [...this.timelineData.all_events];

        if (categories && categories.size > 0) {
            events = events.filter(event =>
                event.categories.some(cat => categories.has(cat)) ||
                event.themes.some(theme => categories.has(theme))
            );
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            events = events.filter(event =>
                event.description?.toLowerCase().includes(q) ||
                event.keywords?.some(kw => kw.toLowerCase().includes(q)) ||
                event.categories?.some(cat => cat.toLowerCase().includes(q)) ||
                event.date?.includes(q)
            );
        }

        return events;
    }
};

export default DataManager;
