// PLAYER FACTORY
const Player = (mark) => {

};


// GAME BOARD MODULE
const gameBoard = (() => {
  let boardArray = ['','','','','','','','',''];

  function updateBoard(index, marker) {
    boardArray[index] = marker;
  }

  return {
    boardArray : boardArray,
    updateBoard : updateBoard
  }
})();




// DISPLAY CONTROLLER MODULE
const displayController = (() => {
  // DOM elements
  const board = document.querySelector('.game-board');
  const boardCells = Array.from(document.querySelectorAll('.board-cell'));
  const dialogBox = document.querySelector('.dialog-box');

  // bind events
  boardCells.forEach(cell => {
    cell.addEventListener('click', e => { checkMove(e.target) });
  });

  _render();

  // functions
  function _render() {
    _buildBoard();
  }

  function _buildBoard() {
    let i = 0;
    boardCells.forEach(cell => {
      _assignMarker(cell, i);
      i++;
    });
  }

  function _assignMarker(cell, i) {
    cell.textContent = gameBoard.boardArray[i];
  }

  function checkMove(cell) {
    if (cell.textContent === '') {
      _addMarker(cell)
    } else {
      dialogBox.textContent = "You can't play here!"
    }
  }

  function _addMarker(cell) {
      const marker = 'X';
      const index = _findIndex(cell);
      gameBoard.updateBoard(index, marker);
      _render(); 
  }

  function _findIndex(cell) {
    for (var i = 0; cell = cell.previousElementSibling; i++);
    return i;
  }

  return {
    checkMove: checkMove
  };
})();