if(!("toChangeId" in localStorage)){
    localStorage.setItem("toChangeId",JSON.stringify("10"))
}
let toChangeId = JSON.parse(localStorage.getItem("toChangeId"));

console.log("few");
let currentUser = new User("gili@gmail.com", "561234");
sessionStorage.setItem('currentUser', JSON.stringify(currentUser));




function LoginButton() {
    let mail = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    let fajaxRequest = new FajaxRequest();
    let response = fajaxRequest.open("GET", "myapi/database/mail=" + mail, {});
    if (checkStatus(response)) {
        if (isReady(response)) {
            initUser(mail, password);
            alert("you loged in successfully!");
            let path= document.querySelector("#listlink");
            path.style.display="block";
            renderTasks();
        }
    }
}

function initUser(mail, password) {
    currentUser.mail = mail;
    currentUser.password = password;
    let fajaxRequest = new FajaxRequest();
    let response = fajaxRequest.open("GET", "myapi/database/mail=" + mail + "/tasks=90", {});
    if(response.body){
        currentUser.tasks = response.body;
    } else {
        currentUser.tasks = [];
    }
    
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
}



function signUpButton() {
    console.log("signup");
    let mail = document.querySelector("#email2").value;
    console.log("mail:")
    console.log(mail);
    let password = document.querySelector("#password2").value;
    let fajaxRequest = new FajaxRequest();
    let request = fajaxRequest.open("GET", "myapi/database/mail=" + mail, {});
    console.log(request);
    if (isReady(request)) {
        if (checkStatus(request)) {
            alert("user exists. log in.");
        } else {
            console.log("init")
            initUser(mail, password);
            fajaxRequest.open("POST", "myapi/database", {});
            let path= document.querySelector("#listlink");
            path.style.display="block";
            renderTasks();
            alert("you signed up successfully!");
        }

    }

}





function isReady(response) {
    if (response.readyState === 4) { return true; } else return false;
}



function checkStatus(response) {
    if (response.statusCode !== 200) { alert("your request isn't valid, try again!"); return false; }
    else return true;
}

function addItem() {
    let task = document.querySelector('#newitem').value;
    // todolist.todo.push({ id: toChangeId, label: task, done: false });
    let req = new FajaxRequest();
    let response = req.open("POST", "myapi/database/mail=" + currentUser.mail + "/tasks=90", { description: task, id: "input_"+toChangeId });
    

}

function deleteItem(id) {
    console.log("delete")
    let req = new FajaxRequest();
    let response = req.open("DELETE", "myapi/database/mail=" + currentUser.mail + "/id=" + id, {});
}


function renderTasks(){
    let request = new FajaxRequest();
    let response = request.open("GET", "myapi/database/mail="+ currentUser.mail +"/tasks=90", {} );
    for(const item of response.body ){
        todolist.todo.push({id: item.id.slice(item.id.match(/\d/).index), label: item.description, done: false});
    }
}

function putTask(task_id){
    let input = document.querySelector("#input_"+task_id).value;
    let request = new FajaxRequest();
    let response = request.open("PUT", "myapi/database/mail="+ currentUser.mail +"/id=input_" + task_id, {id: "input_"+task_id, description: input} );

}


let botton = document.querySelector("#bottone");
let black = document.querySelector("#black");
botton.addEventListener('click', change)
function change(){
    if(black.style.display==='none')
        {black.style.display = 'block';}
    else{ black.style.display='none'}

}
let header = document.querySelector("#header1");
let date = new Date();
let d = date.getDate() +"." +date.getMonth() + "."+date.getFullYear();
header.innerText = d;


