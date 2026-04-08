// Simple hash-based router for SPA navigation
const Router = {
    routes: {},
    currentRoute: null,

    add(pattern, handler) {
        this.routes[pattern] = handler;
    },

    resolve() {
        const hash = window.location.hash.slice(1) || '/';

        // Try exact match first
        if (this.routes[hash]) {
            this.currentRoute = hash;
            this.routes[hash]();
            return;
        }

        // Try pattern matching (e.g., /chapter/:year, /event/:id)
        for (const [pattern, handler] of Object.entries(this.routes)) {
            const paramNames = [];
            const regexStr = pattern.replace(/:([^/]+)/g, (_, name) => {
                paramNames.push(name);
                return '([^/]+)';
            });
            const match = hash.match(new RegExp(`^${regexStr}$`));
            if (match) {
                const params = {};
                paramNames.forEach((name, i) => params[name] = match[i + 1]);
                this.currentRoute = hash;
                handler(params);
                return;
            }
        }

        // Fallback to landing
        this.currentRoute = '/';
        if (this.routes['/']) this.routes['/']();
    },

    navigate(path) {
        window.location.hash = path;
    },

    init() {
        window.addEventListener('hashchange', () => this.resolve());
        this.resolve();
    }
};

export default Router;
