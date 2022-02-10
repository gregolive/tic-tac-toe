// DISPLAYCONTROLLER MODULE
const displayController = (() => {
  // DOM elements
  const board = document.querySelector('.game-board');
  const boardCells = Array.from(document.querySelectorAll('.board-cell'));

  // bind events
  boardCells.forEach(cell => {
    cell.addEventListener('click', addMarker)
  });

  _render();

  function _render() {

  }

  return {

  }
})();

// GAMEBOARD MODULE
const gameBoard = (() => {
  let boardArray = ['','','','','','','','',''];

  return {

  }
})();

// PLAYER FACTORY
const Player = (mark) => {

};