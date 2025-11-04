import { Router } from './router.js';
import { createMainMenu } from './games/mainMenu.js';
import { createDolphinGame } from './games/dolphinGame.js';
import { createTamagotchiGame } from './games/tamagotchiGame.js';

console.log('Starting game collection with routing...');

// Initialize the router
const router = new Router();

// Register routes
router.addRoute('menu', createMainMenu);
router.addRoute('dolphin', createDolphinGame);
router.addRoute('tamagotchi', createTamagotchiGame);

// If no hash is set, default to menu
if (!window.location.hash) {
    window.location.hash = '#menu';
}
