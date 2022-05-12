


function renderShape (shape, playerIndex) {
    let table = document.createElement('table');

    table.classList.add(`player${playerIndex}`);
    table.index = shape._index;
    for (const row of shape._data) {
        let tr = document.createElement('tr');

        for (const cell of row) {
            let td = document.createElement('td');
            if (cell) td.classList.add('full');
            else td.classList.add('empty');
            tr.appendChild(td);
        }

        table.appendChild(tr);
    }
 
    table.rotation = 0;
    table.mirror = false;

    table.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        if (String(table.classList).indexOf(`player${game._curPlayer}`) < 0) return;
        selectedShape(event);
        shape.rotate();
        table.rotation += 90;
        transformShape(table);

    });

    table.addEventListener('dblclick', function  (event) {
        event.preventDefault();
        if (String(table.classList).indexOf(`player${game._curPlayer}`) < 0) return;
        if (table.rotation % 180) return;
        shape.mirror();
        table.mirror = !table.mirror;
        transformShape(table);
    });
    return table;
}


function transformShape (table) {
        table.style.transform = `rotate(${table.rotation}deg) scaleX(${table.mirror? -1: 1})`;
}

function renderBoard (board) {
 
    let table = document.createElement('table');
    table.id = 'board';

    for (const [i, row] of board._board.entries()) {
        let tr = document.createElement('tr');

        for (const [j, cell] of row.entries()) {
            let td = document.createElement('td');
            td.classList.add(`color${cell}`);
            td.addEventListener('mouseover', shapeOnBoard);
            td.addEventListener('mouseleave', clearHovers);
            td.addEventListener('click', placeShape);
            td.i = i;
            td.j = j;
            tr.appendChild(td);
           
        }

        table.appendChild(tr);
    }

    return table;
}

function renderGame(game){
    // reset 
    document.getElementById('gameboard').innerHTML = '';
    document.getElementsByClassName("curPlayersShapes")[0].innerHTML = '';
    for (const index of [1, 2, 3]) {  
        document.querySelector(`.next${index}.playerShapes`).innerHTML = '';
    }


    let HTMLBoard = renderBoard(game._board);
    document.getElementById('gameboard').appendChild(HTMLBoard);

    // currnet
    for (let i = 0; i < 21; ++i) {
        if (!game._players[game._curPlayer]._existShapes[i]) continue;
        let shape = new Shape(shapesData[i], i);
        if (window.innerWidth < 700) shape.rotate();
        let HTMLShape = renderShape(shape, game._curPlayer);
    
        HTMLShape.addEventListener('click', selectedShape);
    
        document.getElementsByClassName("curPlayersShapes")[0].appendChild(HTMLShape);
        document.querySelector('#curPlayer').className = `player${game._curPlayer}`;

        if (game._players[game._curPlayer].details) {
            applyImage(document.querySelector('#curPlayer .playerDetails'), (game._players[game._curPlayer].details.profile));
        }
        else applyImage(document.querySelector('#curPlayer .playerDetails'), defaultProfiles[game._curPlayer]);

        document.querySelector('#curPlayer').className = `player${game._curPlayer}`;
    }

    // others
    for (let i = 0; i < 21; ++i) {
        for (const index of [1, 2, 3]) {
            if (!game._players[nextPlayer(game._curPlayer, index)]._existShapes[i]) continue;
            let shape = new Shape(shapesData[i], i);
            if (window.innerWidth >= 700) shape.rotate();
            let HTMLShape = renderShape(shape, nextPlayer(game._curPlayer, index));

        
            [1, 2, 3, 4].forEach(a => document.querySelector(`#next${index}`).classList.remove(`player${a}`));
            document.querySelector(`#next${index}`).classList.add(`player${nextPlayer(game._curPlayer, index)}`);

            document.querySelector(`.next${index}.playerShapes`).appendChild(HTMLShape);
            
            if (game._players[nextPlayer(game._curPlayer, index)].details) {
                applyImage(document.querySelector(`#next${index} .playerDetails`), (game._players[nextPlayer(game._curPlayer, index)].details.profile));
            } else applyImage(document.querySelector(`#next${index} .playerDetails`), defaultProfiles[nextPlayer(game._curPlayer, index)]);

        }
    }

}

function applyImage (dest, url) {
    dest.style.background = `url(${url})`;
}

function renderImage(src, size = 50) {
    let img = new Image()
    img.src = src;
    // img.width = size;

    img.onload = () => {
        let canvas = document.createElement('canvas');
        canvas.height = size;
        canvas.width = size;
        let cx = canvas.getContext('2d');
        cx.drawImage(img, 0, 0, size, size);

        let url = canvas.toDataURL();
        return url;
    }
}

function nextPlayer (cur, turns) {
    for (let i = 0; i< turns; ++i) cur = cur % 4 + 1;
    return cur;
}

function selectedShape (event) {
    if (!game._players[game._curPlayer].isHuman) {
        return;
    }
    document.querySelectorAll('.selected').forEach(ele => ele.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    game._curShape = event.currentTarget;
}

document.querySelector(".curPlayersShapes").addEventListener('mouseover', function() {
    if (!game._players[game._curPlayer].isHuman) this.style.cursor = 'not-allowed';
    else this.style.cursor = 'grab';
})