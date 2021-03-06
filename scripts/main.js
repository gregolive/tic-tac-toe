// PLAYER FACTORY
const Player = (name, marker) => {
  let computer = false;

  const checkPlayer = opponent => {
    if (obj.name === '') {
      _setComputer(opponent);
    }
  }

  const _setComputer = opponent => {
    obj.name = (opponent.name === 'Computer') ? 'Computer 2' : 'Computer';
    obj.marker = (opponent.marker === 'X') ? 'O' : 'X';
    obj.computer = true;
  }

  const computerPlayerMove = () => {
    const board = gameBoard.boardArray;
    let move = 4;
    let target = board[move];
    while (target !== '') {
      move = Math.floor(Math.random()*board.length);
      target = board[move];
    }
    return move;
  }

  const obj = { name, marker, computer, checkPlayer, computerPlayerMove };
  return obj;
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
    player2.checkPlayer(player1);
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
  }

  function checkWinner() {
    let winner = null;
    winningCombos.forEach(combo => {
      let array = [boardArray[combo[0]], boardArray[combo[1]], boardArray[combo[2]]];
      if (_allSame(array) && _allFilled(array)) {
        winner = combo;
      }
    });
    if (winner === null) { _playTurn(); }
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
  let errorCount = 0;

  // DOM elements
  const modal = document.querySelector('.modal');
  const form = document.querySelector('.game-form');
  const playerCount1 = document.querySelector('#one-player');
  const playerCount2 = document.querySelector('#two-player');
  const playerOneName = document.querySelector('#player1');
  const playerOneMarker = document.querySelector('#player1-marker');
  const playerTwoName = document.querySelector('#player2');
  const playerTwoMarker = document.querySelector('#player2-marker');
  const feedback = Array.from(document.querySelectorAll('.invalid-feedback'));

  // bind events
  form.addEventListener('submit', _playGame);
  playerCount1.addEventListener('click', _disablePlayer2Input);
  playerCount2.addEventListener('click', _enablePlayer2Input)

  _render();

  // functions
  function _render() {
    modal.style.display = 'flex';
  }

  function _playGame(e) {
    e.preventDefault(); // stop refresh
    if (!_verifyInputs()) { 
      errorCount = 0;
      return; 
    }
    _closeModal();
    gameBoard.render();
    displayController.render();
  }

  function _verifyInputs() {
    _verifyNumberOfPlayers();
    _verifyPlayer1();
    _verifyPlayer2();
    return (errorCount > 0) ? false : true;
  }

  function _verifyNumberOfPlayers() {
    if (playerCount1.checked === true || playerCount2.checked === true) {
      feedback[0].style.display = 'none';
      return true;
    } else {
      feedback[0].style.display = 'block';
      errorCount++;
      return false;
    } 
  }

  function _verifyPlayer1() {
    if (playerOneName.value === '' || playerOneMarker.value === '') {
      feedback[1].style.display = 'block';
      errorCount++;
      return false;
    } else {
      feedback[1].style.display = 'none';
      return true;
    }
  }

  function _verifyPlayer2() {
    if ((playerCount2.checked === true || playerCount1.checked === false) && 
        (playerOneMarker.value.toUpperCase() === playerTwoMarker.value.toUpperCase() || playerTwoName.value === '' || playerTwoMarker.value === '')) {
      feedback[2].style.display = 'block';
      errorCount++;
      return false;
    } else {
      feedback[2].style.display = 'none';
      return true;
    }
  }

  function _closeModal() {
    modal.style.display = 'none';
  }

  function _enablePlayer2Input(e) {
    if (e.target.checked) {
      playerTwoName.removeAttribute("disabled");
      playerTwoMarker.removeAttribute("disabled");
    }
  }

  function _disablePlayer2Input(e) {
    if (e.target.checked) {
      playerTwoName.setAttribute("disabled", "disabled");
      playerTwoMarker.setAttribute("disabled", "disabled");
      playerTwoName.value = "";
      playerTwoMarker.value = "";
    }
  }

  function setPlayers() {
    return [[playerOneName.value, playerOneMarker.value.toUpperCase()], 
            [playerTwoName.value, playerTwoMarker.value.toUpperCase()]];
  }

  return { setPlayers: setPlayers }
})();

// DISPLAY CONTROLLER MODULE
const displayController = (() => {
  let gameover = false;
  let winner = null;

  // DOM elements
  const boardCells = Array.from(document.querySelectorAll('.board-cell'));
  const dialogBox = document.querySelector('.dialog-box');
  const replayLink = document.createElement('a');
  replayLink.textContent = 'Play again?'
  replayLink.href = '.';

  // bind events
  boardCells.forEach(cell => {
    cell.addEventListener('click', _playerMove);
  });

  // functions
  function render() {
    _updateDialogBox();
    _buildBoard();
    if (gameover === false) { _checkPlayer(); }
  }

  function _updateDialogBox() {
    const player = gameBoard.getCurrentPlayer();
    if (gameover === false) {
      _displayNextTurn(player);
    } else {
      if (winner === null) {
        _displayTie();
      } else {
        _displayWinner(player);
      }
    }
  }

  function _displayNextTurn(player) {
    dialogBox.textContent = `${player.name}'s turn.`;
  }

  function _displayTie() {
    dialogBox.textContent = "It's a tie! ";
    dialogBox.appendChild(replayLink);
    _animateTiedBoard();
  }

  function _animateTiedBoard() {
    boardCells.forEach(cell =>{
      _shake(cell);
    })
  }

  function _shake(el) {
    el.style.animation = "shake 0.5s";
  }

  function _displayWinner(player) {
    dialogBox.textContent = `${player.name} wins! `;
    dialogBox.appendChild(replayLink);
    _animateWinningMarkers();
  }

  function _animateWinningMarkers() {
    winner.forEach(cell =>{
      boardCells[cell].classList.add("text-danger");
      _flip(boardCells[cell]);
    })
  }

  function _flip(el) {
    el.style.transform = "rotatey(" + 360 + "deg)";
    el.style.transitionDuration = "0.75s";
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

  function _playerMove(e) {
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
      dialogBox.textContent = `Woah ${player.name}! You can't play here.`;
      return false;
    }
  }

  function _addMarker(cell, player) {
    const index = _findIndex(cell);
    console.log(index);
    gameBoard.updateBoard(index, player.marker);
  }

  function _findIndex(cell) {
    for (var i = 0; cell = cell.previousElementSibling; i++);
    return i;
  }

  function _checkPlayer() {
    const player = gameBoard.getCurrentPlayer();
    if (player.computer === true) {
      _computerMove(player);
    }
  }

  function _computerMove(player) {
    const move = player.computerPlayerMove();
    console.log(move);
    gameBoard.updateBoard(move, player.marker);
    _checkGameOver();
    render();
  }

  function _checkGameOver() {
    winner = gameBoard.checkWinner();
    if (winner !== null || gameBoard.getTurn() === 9) {
      gameover = true;
      _removeEventListeners();
    }
  }

  function _removeEventListeners() {
    boardCells.forEach(cell => {
      cell.removeEventListener('click', _playerMove);
    });
  }

  return { render: render }
})();