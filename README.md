# Tic Tac Toe

A miniamlist Tic Tac Toe app.

[Live demo](https://gregolive.github.io/tic-tac-toe/) 👈

## Functionality

- Vanilla CSS for main board display and modal styling via Bootstrap
- Javascript factory function for players and modules for controlling modal form input, display elements, and the game board
- Modal form open at app startup so user can select number of players and input player info (Javascript used to ensure proper form input and display errors)
- Players input their move by clicking on the board
- Dialog box below the board alerts players of who's turn it is and on game over displays a 'Play Again?' link
- On game over CSS animations are added via Javascript to either the 3 winning squares or the entire board in the event of a tie
- Two player game involves two human players making moves until game over
- One player game includes a computer player that makes random moves

## Reflection

Creating this tic tac toe app was the first time I implemented factory functions and modules in Javascript. Compared to using Object prototyping [Library project](https://github.com/gregolive/library), the ability of factory functions and modules to limit the use of globally scoped variables and functions made the code feel much cleaner.

It was also the first project in which I implemented Javascript form verification, and to me, this felt much cleaner than HTML verification with browser popups.