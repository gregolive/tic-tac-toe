// PLAYER FACTORY
const Player = (name, marker) => {
  const getName = name;
  const getMarker = marker;

  return { getName, getMarker }
};

// MODAL CONTROLLER MODULE
const modalController = (() => {
  // DOM elements
  const modal = document.querySelector(".modal");
  const form = document.querySelector(".game-form");
  const playerOneName = document.querySelector("#player1");
  const playerOneMarker = document.querySelector("#player1-marker");
  const playerTwoName = document.querySelector("#player2");
  const playerTwoMarker = document.querySelector("#player2-marker");

  // bind events
  form.addEventListener('submit', _playGame);

  _render();

  // functions
  function _render() {
    modal.style.display = 'flex';
  }

  function _playGame(e) {
    _closeModal();
    gameBoard.buildPlayers();
    displayController.render();
    e.preventDefault(); // stop refresh
  }

  function setPlayers() {
    return [[playerOneName.value, playerOneMarker.value], [playerTwoName.value, playerTwoMarker.value]]
  }

  function _closeModal() {
    modal.style.display = 'none';
  }

  return { setPlayers: setPlayers }
})();

// GAME BOARD MODULE
const gameBoard = (() => {
  let boardArray = ['','','','','','','','',''];
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
  ];

  const players = buildPlayers();
  let turn = Math.floor(Math.random()*2);

  function buildPlayers() {
    const players = modalController.setPlayers();
    const player1 = Player(players[0][0], players[0][1]);
    const player2 = Player(players[1][0], players[1][1]);
    console.log(player1);
    return [player1, player2]
  }

  function updateBoard(index, marker) {
    boardArray[index] = marker;
  }

  function getCurrentPlayer() {
    const currentPlayer = players[turn];
    return currentPlayer;
  }

  function _playTurn() {
    turn = (turn === 0) ? 1 : 0;
  }

  function checkWinner() {
    let winner = false;
    winningCombos.forEach(combo => {
      let array = [boardArray[combo[0]], boardArray[combo[1]], boardArray[combo[2]]];
      if (_allSame(array) && _allFilled(array)) {
        winner = true;
      }
    });
    if (winner === false) { _playTurn() };
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

  return {
    boardArray: boardArray,
    buildPlayers: buildPlayers,
    updateBoard: updateBoard,
    getCurrentPlayer: getCurrentPlayer,
    checkWinner: checkWinner
  }
})();

// DISPLAY CONTROLLER MODULE
const displayController = (() => {
  let gameover = false;

  // DOM elements
  const board = document.querySelector('.game-board');
  const boardCells = Array.from(document.querySelectorAll('.board-cell'));
  const dialogBox = document.querySelector('.dialog-box');

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
      _displayWinner(player);
    }
  }

  function _displayNextTurn(player) {
    dialogBox.textContent = `${player.getName}'s turn.`;
  }

  function _displayWinner(player) {
    const replayLink = document.createElement('a');
    replayLink.textContent = "Play again?"
    replayLink.href = ".";
    
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
    if (_checkMove(e.target, player) === false) { return };
    _addMarker(e.target, player);
    _boardWinner();
    render();
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

  function _boardWinner() {
    if (gameBoard.checkWinner() === true) {
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