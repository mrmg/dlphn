export class Router {
    constructor() {
        this.routes = {};
        this.currentGame = null;
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }
    
    addRoute(hash, callback) {
        this.routes[hash] = callback;
    }
    
    handleRoute() {
        const hash = window.location.hash.slice(1) || 'menu'; // Default to menu
        
        // Clean up current game if it exists
        if (this.currentGame) {
            this.currentGame.destroy();
            this.currentGame = null;
        }
        
        // Clear the game container
        const gameContainer = document.getElementById('game');
        gameContainer.innerHTML = '';
        
        // Route to the appropriate game/menu
        if (this.routes[hash]) {
            this.currentGame = this.routes[hash]();
        } else {
            // Default to menu if route not found
            window.location.hash = '#menu';
        }
    }
    
    navigateTo(hash) {
        window.location.hash = `#${hash}`;
    }
} 