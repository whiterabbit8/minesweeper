import Minesweeper from './minesweeper.js';

const game = new Minesweeper(10, 10, 10);

function showInterface() {
  const gameWindow = document.createElement('div');
  gameWindow.className = 'game-wrapper';
  document.body.append(gameWindow);
  const gameHeader = document.createElement('div');
  gameHeader.className = 'game-header';
  gameWindow.append(gameHeader);
  const startBtn = document.createElement('div');
  startBtn.className = 'start-button';
  gameHeader.append(startBtn);
}

showInterface();
game.createField();
game.showField();

const startButton = document.querySelector('.start-button');
const field = document.querySelector('.field');

field.addEventListener('click', (e) => {
  game.openCell(e);
});

field.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  game.setFlag(e);
})

startButton.addEventListener('click', () => {
  game.resetField();
})