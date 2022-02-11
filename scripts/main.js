// PLAYER FACTORY
const Player = (name, marker) => {
  const getName = name;
  const getMarker = marker;

  return { getName, getMarker }
};

// GAME BOARD MODULE
const gameBoard = (() => {
  let boardArray = ['','','','','','','','',''];
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
  ];
  let players = [];
  let turn = 0;
  let turnOrder = Math.floor(Math.random()*2);

  // functions
  function render() {
    players = _buildPlayers();
  }

  function _buildPlayers() {
    const players = modalController.setPlayers();
    const player1 = Player(players[0][0], players[0][1]);
    const player2 = Player(players[1][0], players[1][1]);
    return [player1, player2];
  }

  function updateBoard(index, marker) {
    boardArray[index] = marker;
  }

  function getCurrentPlayer() {
    const currentPlayer = players[turnOrder];
    return currentPlayer;
  }

  function _playTurn() {
    turnOrder = (turnOrder === 0) ? 1 : 0;
    turn++;
    console.log(turn);
  }

  function checkWinner() {
    let winner = false;
    winningCombos.forEach(combo => {
      let array = [boardArray[combo[0]], boardArray[combo[1]], boardArray[combo[2]]];
      if (_allSame(array) && _allFilled(array)) {
        winner = true;
      }
    });
    if (winner === false) { _playTurn(); }
    return winner;
  }

  function _allSame(array) {
    for (var i = 0; i < array.length - 1; i++) {
      if (array[i] !== array[i+1]) { 
        return false;
      }
    }
    return true;
  }

  function _allFilled(array) {
    let i = 0;
    array.forEach(cell => {
      if (cell === '') { i++; }
    });
    return (i === 0) ? true : false;
  }

  function getTurn() {
    return turn;
  }

  return {
    boardArray: boardArray,
    render: render,
    updateBoard: updateBoard,
    getCurrentPlayer: getCurrentPlayer,
    checkWinner: checkWinner,
    getTurn, getTurn
  }
})();

// MODAL CONTROLLER MODULE
const modalController = (() => {
  // DOM elements
  const modal = document.querySelector('.modal');
  const form = document.querySelector('.game-form');
  const playerOneName = document.querySelector('#player1');
  const playerOneMarker = document.querySelector('#player1-marker');
  const playerTwoName = document.querySelector('#player2');
  const playerTwoMarker = document.querySelector('#player2-marker');
  const feedback = document.querySelector('.invalid-feedback');

  // bind events
  form.addEventListener('submit', _playGame);

  _render();

  // functions
  function _render() {
    modal.style.display = 'flex';
  }

  function _playGame(e) {
    e.preventDefault(); // stop refresh
    if (!_verifyInputs()) { return; }
    _closeModal();
    gameBoard.render();
    displayController.render();
  }

  function _verifyInputs() {
    if (playerOneMarker.value === playerTwoMarker.value) {
      feedback.style.display = 'block';
      return false;
    } else {
      return true;
    }
  }

  function setPlayers() {
    return [[playerOneName.value, playerOneMarker.value.toUpperCase()], 
            [playerTwoName.value, playerTwoMarker.value.toUpperCase()]];
  }

  function _closeModal() {
    modal.style.display = 'none';
  }

  return { setPlayers: setPlayers }
})();

// DISPLAY CONTROLLER MODULE
const displayController = (() => {
  let gameover = false;
  let winner = false;

  // DOM elements
  const board = document.querySelector('.game-board');
  const boardCells = Array.from(document.querySelectorAll('.board-cell'));
  const dialogBox = document.querySelector('.dialog-box');
  const replayLink = document.createElement('a');
  replayLink.textContent = 'Play again?'
  replayLink.href = '.';

  // bind events
  boardCells.forEach(cell => {
    cell.addEventListener('click', _makeMove);
  });

  // functions
  function render() {
    _updateDialogBox();
    _buildBoard();
  }

  function _updateDialogBox() {
    const player = gameBoard.getCurrentPlayer();
    if (gameover === false) {
      _displayNextTurn(player);
    } else {
      if (winner === false) {
        _displayTie();
      } else {
        _displayWinner(player);
      }
    }
  }

  function _displayNextTurn(player) {
    dialogBox.textContent = `${player.getName}'s turn.`;
  }

  function _displayTie() {
    dialogBox.textContent = "It's a tie! ";
    dialogBox.appendChild(replayLink);
  }

  function _displayWinner(player) {
    dialogBox.textContent = `${player.getName} wins! `;
    dialogBox.appendChild(replayLink);
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

  function _makeMove(e) {
    const player = gameBoard.getCurrentPlayer();
    if (_verifyMove(e.target, player) === false) { return; }
    _addMarker(e.target, player);
    _checkGameOver();
    render();
  }

  function _verifyMove(cell, player) {
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

  function _checkGameOver() {
    if (gameBoard.checkWinner() === true) {
      winner = true;
      gameover = true;
      _removeEventListeners();
    } else if (gameBoard.getTurn() === 9) {
      gameover = true;
      _removeEventListeners();
    }
  }

  function _removeEventListeners() {
    boardCells.forEach(cell => {
      cell.removeEventListener('click', _makeMove);
    });
  }

  return { render: render }
})();