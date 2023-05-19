import Minesweeper from './minesweeper.js';

const game = new Minesweeper(10, 10, 10);
game.createField();
game.showField();

document.addEventListener('click', (e) => {
  game.openCell(e);
});

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  game.setFlag(e);
})
