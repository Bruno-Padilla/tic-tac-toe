// Game board
const gameBoard = (function() {

    /* - - - Variables - - - */
    let board;
    let nTokensPlaced;
    let currentPlayer;
    let lastSpotOccupied;
    let spotsCoordinates;

    /* - - - Getters & Setters - - - */
    function getCurrentPlayer() { return currentPlayer; }
    function setCurrentPlayer(newPlayer) { currentPlayer = newPlayer };
    function getBoard() { return board; }
    function getLastSpotOccupied() { return lastSpotOccupied };
    function setLastSpotOccupied(spot) { lastSpotOccupied = spot };
    function getSpotsCoordinates() { return spotsCoordinates };
    function setSpotsCoordinates(leftSpotsCoordinates) { spotsCoordinates = leftSpotsCoordinates };

    /* - - - Functions - - - */
    // Initialize game
    function initGame() {
        board = [ [], [], [] ];
        nTokensPlaced = 0;
        //currentPlayer = 'X';
        spotsCoordinates = ['00', '01', '02', '10', '11', '12', '20', '21', '22'];
    }
    
    // Place a token in the board ( X - O )
    function placeTokenPosition(coordinate) {
        // Get current token and position
        const token = getCurrentPlayer();
        let rowIndex = coordinate[0];
        let columnIndex = coordinate[1];

        // Keep asking for another coordinate if the space is taken
        let spaceChoseTaken = false;
        do {
            // If the chosen space is taken
            if (board[rowIndex][columnIndex]) {
                spaceChoseTaken = true;
                
                // Ask and check if the new space is taken or not
                let coordinate = prompt('Space occupied - Select another space');
                rowIndex = coordinate[0];
                columnIndex = coordinate[1];
                if (!board[rowIndex][columnIndex]) {
                    spaceChoseTaken = false;
                }
            }
        } while (spaceChoseTaken);

        // Place token
        board[rowIndex][columnIndex] = token;
        setLastSpotOccupied(`${rowIndex}${columnIndex}`);
        nTokensPlaced++;
    }

    // Check if the current player (the token placed) has won
    function checkWinner() {
        // Get the played token and position
        const tokenPlayed = getCurrentPlayer();
        const rowPlayedIndex = getLastSpotOccupied()[0];
        const columnPlayedIndex = getLastSpotOccupied()[1];

        // Return if theres no enough tokens to check over a winner
        if (nTokensPlaced < 5) return;

        // Variables
        let rowWin = true;
        let columnWin = true;
        let diagonalWin = true;
        let inverseDiagonalWin = true;
        
        // Checking
        for (let i=0; i<3; i++) {
            // Check row where the player played
            if (board[rowPlayedIndex][i] != tokenPlayed) rowWin=false;

            // Check column where the player played
            if (board[i][columnPlayedIndex] != tokenPlayed) columnWin=false;

            // Check diagonal
            if (board[i][i] != tokenPlayed) diagonalWin = false;

            // Check inverse diagonal
            if (board[i][2-i] != tokenPlayed) inverseDiagonalWin = false;
        }

        // Return the winner if there is one
        if ( rowWin || columnWin || diagonalWin || inverseDiagonalWin )  return `${tokenPlayed} wins`;
        
        // Return a draw if no one won and theres no spaces left
        else if (nTokensPlaced == 9) return 'Its a draw';
    }

    // Change token
    function changeToken() {
        if (currentPlayer == 'X') currentPlayer = 'O';
        else currentPlayer = 'X';
    }

    /* - - - Return a board object with its methods - - - */
    return { placeTokenPosition, checkWinner, initGame, changeToken, setCurrentPlayer, getCurrentPlayer, getBoard, getLastSpotOccupied, setLastSpotOccupied, getSpotsCoordinates, setSpotsCoordinates };

})();


// Players
function createPlayer(assignedToken) {

    let name;
    let token;
    let victories;

    /* - - - Getters & Setters - - -*/
    function setName(newName) { name = newName; }
    function getName() { return name; }
    function getToken() { return token };
    function setToken(newToken) { token = newToken };
    function setVictories(newVictories) { victories = newVictories; }
    function getVictories() { return victories; }

    /* - - - Functions - - - */
    function initPlayer() { 
        name = '';
        token = assignedToken;
        victories = 0;
    }

    function resetVictories() { setVictories(0); }
    function increaseVictory() { setVictories(getVictories() + 1); }

    /* - - - Returned object - - - */
    return { setName, getName, setVictories, getVictories, resetVictories, initPlayer, increaseVictory, getToken, setToken }
}

const player_X = createPlayer('X');
const player_O = createPlayer('O');


// Game flow
const gameController = (function() {

    let gameMode;

    // Initialize players
    function initPlayers() {
        // Create players objects
        player_X.initPlayer();
        player_O.initPlayer();
        
        // Ask game mode (player types)
        gameMode = prompt('PP / PC / CC');

        switch (gameMode) {
            case 'PP':
                player_X.setName(prompt('Enter nickname player X'));
                player_O.setName(prompt('Enter nickname player O'));
                break;

            case 'PC':
                player_X.setName(prompt('Enter nickname'));
                player_O.setName('Computer');
                break;

            case 'CC':
                player_X.setName('Computer 1');
                player_O.setName('Computer 2');
                break;
        }
    }
    
    // Play round
    function playRound() {
        let playAgain = false;

        do {
            gameBoard.initGame();
            gameBoard.changeToken();
            let coordinate;

            while (true) {
                // Ask for the current coordinate
                switch (gameMode) {
                    case 'PP':
                        coordinate = prompt('Coordinate');
                        const coordinateIndex = gameBoard.getSpotsCoordinates().indexOf(coordinate);
                        gameBoard.getSpotsCoordinates().splice(coordinateIndex, 1);
                        break;

                    case 'PC':
                        // If is the player turn (X), ask for the coordinate
                        if (player_X.getToken() == gameBoard.getCurrentPlayer()) {
                            if (player_X.getName() != 'Computer') {
                                coordinate = prompt('Coordinate');
                                const coordinateIndex = gameBoard.getSpotsCoordinates().indexOf(coordinate);
                                gameBoard.getSpotsCoordinates().splice(coordinateIndex, 1);
                            }
                            
                            // Else, it is the computer turn, take a random spot
                            else {
                                const randomCoordinateIndex = Math.floor(Math.random() * gameBoard.getSpotsCoordinates().length);
                                coordinate = gameBoard.getSpotsCoordinates()[randomCoordinateIndex];
                                gameBoard.getSpotsCoordinates().splice(randomCoordinateIndex, 1);
                            }
                        }

                        // If is the player turn (O), ask for the coordinate
                        else if (player_O.getToken() == gameBoard.getCurrentPlayer()) {
                            if (player_O.getName() != 'Computer') {
                                coordinate = prompt('Coordinate');
                                const coordinateIndex = gameBoard.getSpotsCoordinates().indexOf(coordinate);
                                gameBoard.getSpotsCoordinates().splice(coordinateIndex, 1);
                            }
                            
                            // Else, it is the computer turn, take a random spot
                            else {
                                const randomCoordinateIndex = Math.floor(Math.random() * gameBoard.getSpotsCoordinates().length);
                                coordinate = gameBoard.getSpotsCoordinates()[randomCoordinateIndex];
                                gameBoard.getSpotsCoordinates().splice(randomCoordinateIndex, 1);
                            }
                        }
                        break;

                    case 'CC':
                        // Take a random spot
                        const randomCoordinateIndex = Math.floor(Math.random() * gameBoard.getSpotsCoordinates().length);
                        coordinate = gameBoard.getSpotsCoordinates()[randomCoordinateIndex];
                        gameBoard.getSpotsCoordinates().splice(randomCoordinateIndex, 1);
                        break;
                }

                // Place the current token in position
                console.log(coordinate);
                gameBoard.placeTokenPosition(coordinate);
                console.log(gameBoard.getBoard());

                // Check winner and change token (player turn)
                const winnerMessage = gameBoard.checkWinner();
                gameBoard.changeToken();
                
                // Display messages when the game is over
                if (winnerMessage) {
                    if (winnerMessage.includes('X')) {
                        player_X.increaseVictory();
                        alert(`${player_X.getName()} wins`);
                    }

                    else if (winnerMessage.includes('O')) {
                        player_O.increaseVictory();
                        alert(`${player_O.getName()} wins`);
                    }

                    else { 
                        alert('Its a draw'); 
                    }

                    alert(`${player_X.getVictories()} - ${player_O.getVictories()}`);

                    break;
                }
            }
            
            // Ask on playing again
            playAgain = confirm('Play again?');

        } while (playAgain);
    }

    return { initPlayers, playRound };
    
})();


gameController.initPlayers();
gameController.playRound();
