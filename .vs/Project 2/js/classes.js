
// Shape ------------------------------------------------------------------------------------------
function Shape (shapeData, i) {
    this._data   = JSON.parse(JSON.stringify(shapeData));
    this.height = this._data.length;
    this.width  = this._data[0].length;
    this._rotate = 0;
    this._mirror = 0;
    this._index = i;
}

// Roates a shape.
Shape.prototype.rotate = function (times = 1) {
    for (let _t = 0; _t < times; ++_t) {
       this._data = this._data[0].map((val, i) => this._data.map(row => row[i]).reverse());
       [this.height, this.width] = [this.width, this.height];
    }
    return this;
}

Shape.prototype.mirror = function (times = 1) {
    for (let _t = 0; _t < times; ++_t) {
        this._data = this._data.map(line => line.reverse());
    }
    return this;
}

Shape.prototype.print = function () {
    const string = ('%c #'.repeat(this.width) + '\n').repeat(this.height);
    const style  = [].concat(...this._data).map(val => `color: ${colors[val]}`);

    // console.log(string, ...style);
}

// TODO: 
Shape.prototype.cornerCode = function (iIndex, jIndex) {
    if (!this._data[iIndex][jIndex]) return [];
}

// Pos ------------------------------------------------------------------------------------------

function Pos (x, y) {
    this.x = x;
    this.y = y;
}


// Board ------------------------------------------------------------------------------------------

function Board(board) {
    if (board === undefined) board = emptyBoard();

    this._board = board;
    this.size = board.length;
}

// Prints the board / shape to the console
Board.prototype.print = function () {
    const string = ('%c #'.repeat(this.size) + '\n').repeat(this.size);
    const style  = [].concat(...this._board).map(val => `color: ${colors[val]}`);

    // console.log(string, ...style);
}

// Return an empty board
Board.prototype.empty = emptyBoard;

Board.prototype.slice = function (pos, height, width) {
    return this._board.slice(pos.y, pos.y + height).map(line => line.slice(pos.x, pos.x + width));
}

Board.prototype.isValidPlace = function (shape, pos, player) {

    // check whether the place is empty
    const shapeArray = [].concat(...shape._data);
 
    const part = this.slice(pos, shape.height, shape.width);
    const partArray = [].concat(...part);
 
    const isEmpty = partArray.reduce((pre, cur, i) => pre + cur * shapeArray[i], 0) === 0;
    if (!isEmpty) return {valid: false};

    // check whether the shape doesn't...
    let sumSides = 0;
    for (let i = 0; i < shape.height; ++i) {
        for (let j = 0; j < shape.width; ++j) {
            if (shape._data[i][j]) {
                sumSides += (pos.y + i) > 0  && this._board[pos.y + i - 1][pos.x + j] === player;
                sumSides += (pos.x + j) < this.size - 1 && this._board[pos.y + i][pos.x + j + 1] === player;
                sumSides += (pos.y + i) < this.size - 1 && this._board[pos.y + i + 1][pos.x + j] === player;
                sumSides += (pos.x + j) > 0  && this._board[pos.y + i][pos.x + j -1] === player;                
            }
        }
    }
    if (sumSides) return {valid: false};

    // check whether the shape touches at least one corner
    let sumCorners = 0;
    let sumCornersAll = 0;
    for (let i = 0; i < shape.height; ++i) {
        for (let j = 0; j < shape.width; ++j) {
            if (shape._data[i][j]) {
                if (pos.y + i> 0) {
                    sumCorners += (pos.x + j) > 0 && this._board[pos.y + i - 1][pos.x + j - 1] === player;
                    sumCorners += (pos.x + j) < this.size - 1 && this._board[pos.y + i - 1][pos.x + j + 1] === player;
                }   
                if (pos.y + i < this.size - 1) {
                    sumCorners += (pos.x + j) > 0 && this._board[pos.y + i + 1][pos.x + j - 1] === player;
                    sumCorners += (pos.x + j) < this.size - 1 && this._board[pos.y + i + 1][pos.x + j + 1] === player;
                }
            }
        }
    }
    
    if(!sumCorners) return {valid: false};

    return {valid: true, sumSides, sumCorners};
}

Board.prototype.place = function (shape, pos, player) {

    for (let i = 0; i < shape.height; ++i) {
        for (let j = 0; j < shape.width; ++j) {
            try {
            if (shape._data[i][j]) this._board[pos.y + i][pos.x + j] = player;
            } catch (e) {
                // console.log(e);
            }
        }
    }
    return this;
}

function emptyBoard () {
    const board = [];

    for (let i = 0; i < BOARD_SIZE; ++i) {
        const line = [];
        for (let j = 0; j < BOARD_SIZE; ++j) {
            line.push(EMPTY);
        }

        board.push(line);
    }
    return board;
}

// Player ----------------------------------------------------------------------------------------
function Player(playerIndex, name, isHuman = false) {
    this._index = playerIndex;
    this._existShapes = '1'.repeat(NUM_OF_SHAPES).split('').map(Boolean);
    this._name = name;
    this._gameover = false;
    this.isHuman = isHuman;
    this.details = null;
}

Player.prototype.placeShape = function (shapeIndex) {
    this._existShapes[shapeIndex] = false;
}

// Game ------------------------------------------------------------------------------------------
function Game () {
    this.name;
    this._board = new Board();
    this._curPlayer = PLAYER1;
    this._players = [null, new Player(PLAYER1), new Player(PLAYER2), new Player(PLAYER3), new Player(PLAYER4)];
    this._curShape = null;
    this.gameovers = 0;

    for (let i = 1; i <= 4; ++i) {
        this._board._board[startPositions[i].y][startPositions[i].x] = i;
    }
}



Game.prototype.bestStep = function () {
    const ORIGINAL_DISTANCE = 0.2;
    const CENTER_DISTANCE = -0.5;
    const TOUCH_OTHERS = 1;
    const COVER_CORNERS = -0.1;
    const RELATION = -0.2;
    const EMPTY_ROOM = 0.1;
    const CORNERS = 0.12;
    // TODO: check empty corners

    let bestStepValue = -Infinity;
    let bestStepDetails = [];

    for (let s = 0; s < NUM_OF_SHAPES; ++s) { // for each shape
        if (!this._players[this._curPlayer]._existShapes[s]) continue; // does the shape exist?
        
        let shape = new Shape(shapesData[s], s);
        for (let m = 0; m < 2; m++) { // mirror
            shape._mirror = m;
            shape.mirror(+!!m);
            for (let dir = 0; dir < 4; ++dir) { // for each rotation
                shape._rotate = dir;
                shape.rotate(+!!dir);
                for (let i = 0; i < BOARD_SIZE - shape.height + 1; ++i) { // y pos
                    for (let j = 0; j < BOARD_SIZE - shape.width + 1; ++j) { // x pos
                        let pos = new Pos(j, i);
                        let result = this._board.isValidPlace(shape, pos, this._curPlayer);
                        if (!result.valid) continue;

                        // shape size
                        let curValue = [].concat(...shape._data).reduce((a, b) => a + b, 0);

                        // distance from original position
                        curValue += ORIGINAL_DISTANCE * Math.sqrt((startPositions[this._curPlayer].x - j) ** 2 + (startPositions[this._curPlayer].y - i) ** 2);

                        // distance from center
                        curValue += CENTER_DISTANCE * Math.sqrt((10 - j) ** 2 + (10 - i) ** 2);

                        // relationship
                        curValue += RELATION * Math.abs(shape.height - shape.width);

                        // corners & sides
                        curValue += TOUCH_OTHERS * result.sumSides;
                        curValue += COVER_CORNERS * result.sumCorners;

                        // empty room
                        curValue += EMPTY_ROOM * [].concat(...this._board.slice(new Pos(j - 5, i - 5), 10, 10)).reduce((a, b) => a + !b, 0);

                        // corners
                        curValue += CORNERS * shapesCorners[s];

                        let newShape = new Shape(shape._data, s);
                        newShape._mirror = shape._mirror;
                        newShape._rotate = shape._rotate;
                        let step = new Step(newShape, pos, this._curPlayer, s);
                        if (curValue > bestStepValue) {
                            bestStepValue = curValue;
                            bestStepDetails = [step];
                        }
                        else if (curValue === bestStepValue) bestStepDetails.push(step);
                    }
                }
            }
        }
    }

    if (bestStepValue === -Infinity) 
    {
        if (this._players[this._curPlayer]._gameover) {
            this._curPlayer = this._curPlayer % 4 + 1;
            return;
        }
        this._players[this._curPlayer]._gameover = true;
        deleteGame(game.name);
        game.gameovers++;
        const colors = ['Red', 'Green', 'Blue', 'Yellow'];
        alert(`${colors[this._curPlayer]} player failed`);
        this._curPlayer = this._curPlayer % 4 + 1;
        return null;
    }
    return bestStepDetails[Math.floor(Math.random() * bestStepDetails.length)]

}

Game.prototype.turn = function (step) {
    this._board.place(step.shape, step.pos, step.player);

    this._players[this._curPlayer]._existShapes[step.shapeIndex] = false;
    this._curPlayer = this._curPlayer % 4 + 1;
    nextTurn();
    this.bestStep();
}

// Step ------------------------------------------------------------------------------------------
function Step (shape, pos, player, index) {
    this.shape = shape;
    this.pos = pos;
    this.player = player;
    this.shapeIndex = index;
}




