

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', ()=> container.classList.add('right-panel-active')
);
signInButton.addEventListener('click', ()=> container.classList.remove('right-panel-active')
);



let logIn = document.getElementById('logIn');
let signUp = document.getElementById('signUp');
let logout=document.getElementById('logOut');


const inputImg = document.querySelector('input[type="file"]');
inputImg.onchange = imageInput;

function imageInput (event) {
    imageData(event);
    event.path[1].innerHTML += ' ✔';
    event.preventDefault();
}
