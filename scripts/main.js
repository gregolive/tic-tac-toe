// PLAYER FACTORY
const Player = (name, marker) => {
  const getName = name;
  const getMarker = marker;

  return { getName, getMarker }
};


// GAME BOARD MODULE
const gameBoard = (() => {
  let boardArray = ['','','','','','','','',''];
  const players = [Player('Bob', 'X'), Player('John', 'O')];
  let turn = Math.floor(Math.random()*2);

  function updateBoard(index, marker) {
    boardArray[index] = marker;
  }

  function getCurrentPlayer() {
    const currentPlayer = players[turn];
    return currentPlayer;
  }

  function checkWinner() {
    _playTurn();
    return false;
  }

  function _playTurn() {
    turn = (turn === 0) ? 1 : 0;
  }

  return {
    boardArray: boardArray,
    updateBoard: updateBoard,
    getCurrentPlayer: getCurrentPlayer,
    checkWinner, checkWinner
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
    cell.addEventListener('click', e => { _makeMove(e.target) });
  });

  _render();

  // functions
  function _render() {
    _displayTurn(gameBoard.getCurrentPlayer());
    _buildBoard();
  }

  function _displayTurn(player) {
    dialogBox.textContent = `${player.getName}'s turn.`;
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

  function _makeMove(cell) {
    const player = gameBoard.getCurrentPlayer();
    if (_checkMove(cell, player) === false) { return };
    _addMarker(cell, player);
    _initNextTurn();
    _render();
  }

  function _checkMove(cell, player) {
    if (cell.textContent === '') {
      return true;
    } else {
      dialogBox.textContent = `Woah ${player.getName}! You can't play here.`;
      return false;
    }
  }

  function _addMarker(cell, player) {
    const index = _findIndex(cell);
    gameBoard.updateBoard(index, player.getMarker);
  }

  function _findIndex(cell) {
    for (var i = 0; cell = cell.previousElementSibling; i++);
    return i;
  }

  function _initNextTurn() {
    if (gameBoard.checkWinner() === true) {

    } else {
      
    }
  }
})();