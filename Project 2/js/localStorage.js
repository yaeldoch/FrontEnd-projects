if (!localStorage.blokusUsers) localStorage.blokusUsers = '[]';
if (!localStorage.savedGames) localStorage.savedGames = '[]';
delete localStorage.tempProfile;
delete localStorage.newGame;

const logInForm = document.querySelector('.sign-in-container form');
const logInSubmit = document.querySelector('.sign-in-container .si');

const signUpForm = document.querySelector('.sign-up-container form');
const signUpSubmit = document.querySelector('.sign-up-container .su');

logInSubmit.addEventListener('click', (event) => {
    let mail = logInForm.querySelector('#mail').value;
    let password = logInForm.querySelector('#password').value;
    let data = JSON.parse(localStorage.getItem('blokusUsers'));


    for (const element of data) {
        if (element.mail == mail) {
            if (element.password != password) {
                alert('Inncorrect password');
                return false;
            }
            curUser = element;
            localStorage.setItem('curUser', JSON.stringify(curUser));
            return true;
        }
    }

    
    alert('User does not exist');
    return false;
});

signUpSubmit.addEventListener('click', (event) => {
    let mail = signUpForm.querySelector('#mail').value;
    let password=signUpForm.querySelector('#password').value;
    
    if (!mail || !password || !localStorage.tempProfile) {
        alert('One or more of the details is not correct');
        return false;
    }
    let data = JSON.parse(localStorage.getItem('blokusUsers'));
    for(let i = 0; i < data.length; ++i){
        if(data[i].mail == mail){
            alert('User exists');
            // TODO: signin
            return false;
        }
    }


    let name    = signUpForm.querySelector('#name').value;
    let profile = localStorage.getItem('tempProfile');

    let userobj = {mail, name, password, profile};
    curUser = userobj;
    //image
    data.push(userobj);
    localStorage.setItem('blokusUsers', JSON.stringify(data));
    localStorage.setItem('curUser', JSON.stringify(curUser));
    
});

function imageData(event) {
    let files = event.target.files;
    if (files.length === 0) {
        return;
    }
    let reader = new FileReader();
    reader.onload = function(event) {   
        let src = event.target.result;

        let img = new Image()
        img.src = src;
        img.height = 50;

        let size = 100;
        img.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.height = size;
            canvas.width = size;
            let cx = canvas.getContext('2d');
            cx.drawImage(img, 0, 0, size, size);
            let url = canvas.toDataURL();
            localStorage.setItem('tempProfile', url);
        }
    };
    reader.readAsDataURL(files[0]);
}

