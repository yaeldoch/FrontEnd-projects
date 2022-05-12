function HTMLShapeToJS (HTMLShape) {

    let shapeIndex = HTMLShape.index;
    let shape = new Shape(shapesData[shapeIndex], shapeIndex);
    shape._mirror = HTMLShape.mirror;
    shape._rotate = HTMLShape.rotation / 90;
    shape.mirror(shape._mirror);
    shape.rotate(shape._rotate);

    return shape;
}

function shapeOnBoard (event) {
    if (game._curShape === null) return;

    event.currentTarget.style.cursor = 'grabbing';
    
    let shape = HTMLShapeToJS(game._curShape);

    let i = event.currentTarget.i;
    let j = event.currentTarget.j;

    if (i + shape.height > BOARD_SIZE || j + shape.width > BOARD_SIZE) {
        return false;
    }
    
    let isValid = game._board.isValidPlace(shape, new Pos(j, i), game._curPlayer).valid;
    let HTMLRows = document.querySelectorAll('#gameboard table tr');
    clearHovers();

    for (let _i = 0; _i < shape.height; ++_i) {
        let row = HTMLRows[_i + i];
        for (let _j = 0; _j < shape.width; ++_j) {
            if (!shape._data[_i][_j]) continue;

            // row.querySelectorAll('td')[_j + j].style.background = isValid? hoverValid[game._curPlayer]: hoverInvalid[game._curPlayer];
            row.querySelectorAll('td')[_j + j].classList.add(`player${game._curPlayer}`); 
            row.querySelectorAll('td')[_j + j].classList.add(`is-valid-${isValid}`);
        }
    }

}

function placeShape (event) {
    let shape = HTMLShapeToJS(game._curShape);
    let i = event.currentTarget.i;
    let j = event.currentTarget.j;

    if (i + shape.height > BOARD_SIZE || j + shape.width > BOARD_SIZE) {
        return false;
    }
    
    let isValid = game._board.isValidPlace(shape, new Pos(j, i), game._curPlayer).valid;

    if (isValid) {
        game.turn(new Step(shape, new Pos(j, i), game._curPlayer, shape._index));
        renderGame(game);
        game._curShape = null;
    }
}

function clearHovers() {
    let HTMLRows = document.querySelectorAll('#gameboard table tr');
    HTMLRows.forEach(row => row.querySelectorAll('td').forEach(el => {
        el.style.background = "";
        el.classList.remove('is-valid-false');
        el.classList.remove('is-valid-true');
        [1, 2, 3, 4].forEach(n => el.classList.remove(`player${n}`));
    }));
}


function temp (times = 3) {
    for (let i = 0; i< times; ++i) {
        let best = game.bestStep();
        if (!best) {
            nextTurn();
        };
        game.turn(new Step(best.shape, best.pos, best.player, best.shapeIndex));
        renderGame(game);
    }
}

[1, 2, 3].forEach(n => {

    let ele = document.querySelector(`#next${n}`);
    let roll = document.querySelector(`.next${n}.playerShapes`);

    ele.addEventListener('click', function () {

        if (roll.className.indexOf('visible') !== -1) {
            [1, 2, 3].forEach(n2 => {
                document.querySelector(`.next${n2}.playerShapes`).classList.remove('visible');
            });
        } else {
            [1, 2, 3].forEach(n2 => {
                document.querySelector(`.next${n2}.playerShapes`).classList.remove('visible')
            });
            roll.classList.add('visible');
        }
    });
});

function main () {
    let gameDetail = JSON.parse(localStorage.getItem('newGame'));
    game._curPlayer = 1;
    game.name = gameDetail.name;
    
    for (let i = 1; i <= gameDetail.human; ++i) {
        game._players[i].isHuman = true;
        game._players[i].details = gameDetail.players[i];
    }

    if (!gameDetail.isNew) {
        game._board._board = gameDetail._board._board;
        game._board.size = gameDetail._board.size;
       
        game._curPlayer = gameDetail._curPlayer;
        game._players = [null, new Player, new Player, new Player, new Player];
        [1, 2, 3, 4].forEach(n => {
            game._players[n]._index       = gameDetail._players[n]._index;
            game._players[n]._existShapes = gameDetail._players[n]._existShapes;
            game._players[n]._name        = gameDetail._players[n]._name;
            game._players[n].details      = gameDetail._players[n].details;
            game._players[n].isHuman      = gameDetail._players[n].isHuman;

        })

        game.gameovers = gameDetail.gameovers;
    }

    
    renderGame(game);

    if (!game._players[game._curPlayer].isHuman) temp(1);
}

function nextTurn () {
    if (game.gameovers === 4) {
        alert("GAME OVER");
        return;
    }
    if (game._players[game._curPlayer]._gameover) {
        game._curPlayer = game._curPlayer % 4 + 1;
        renderGame(game);
    }
    if (!game._players[game._curPlayer].isHuman) {
        setTimeout(() => temp(1), TIME_PER_TURN * 1000);
    }
}

function saveGame () {
    deleteGame(game.name);
    let savedGames = localStorage.getItem('savedGames') ?? `[]`;
    savedGames = JSON.parse(savedGames);

    savedGames.push(game);
    localStorage.setItem('savedGames', JSON.stringify(savedGames));
    localStorage.setItem('newGame', JSON.stringify(game));
}

function backHome () {
    let link = document.createElement('a');
    link.href = './home.html';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
}

let game = new Game();
main();