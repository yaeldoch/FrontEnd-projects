
let form = document.querySelector('form');
let dataList = document.querySelector('#data');
let savedGames = JSON.parse(localStorage.getItem('savedGames'));
let curUser = JSON.parse(localStorage.getItem('curUser'));
form[`mail1`].value = curUser.mail;
form[`password1`].value = curUser.password;


for (let game of savedGames) {
    if (game._players.slice(1).reduce((a, p) => a + (p.details?.name == curUser.name), 0)) {
        let option = document.createElement('option');
        option.value = game.name;
        dataList.appendChild(option);
    }
}

let submit = document.querySelector('#send');
submit.addEventListener('click', checkForm);
let goForIt= document.querySelector('#send1');
goForIt.addEventListener('click',function(event){
    let gameName = document.querySelector('input[list="data"]').value;
        
    for (let game of savedGames) {
        if (game.name === gameName) {
            localStorage.newGame = JSON.stringify(game);
        }
    }
});
let isValid=true;

function checkForm () {
  
    let blokusUsers = JSON.parse(localStorage.getItem('blokusUsers'));
    savedGames.forEach(el => {
        if (el.name == form['game-name'].value) {
            isValid = false;
            alert('Game name must be unique'); 
        }
    });

    if (!isValid) return false;
        
    let humanPlayers = []
    for (let i = 1; i <= form.human.value; ++i) {
        for (const user of blokusUsers) {
            if (form[`mail${i}`].value == user.mail) {
                if (form[`password${i}`].value != user.password) {
                    alert('incorrect password');
                    return false;
                }
                humanPlayers.push(user);
            }
        }
    }

    if (humanPlayers.length != form.human.value) {
        alert('One or more of the users is not registered');
        return false;
    }

    let gameDetails = {
        name: form['game-name'].value,
        human: form.human.value,
        players: [null, ...humanPlayers],
        isNew: true,
    }


    localStorage.setItem('newGame', JSON.stringify(gameDetails));
    
    move();
    return true;
}