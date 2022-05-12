console.log("hi");

if(!("usersData" in localStorage)){
    localStorage.setItem("usersData",JSON.stringify({users: [],
        teemLeaders: [],}))
} 

const DBapi={

    _data: JSON.parse(localStorage.getItem("usersData")),

    //get methods

    getAllusers () {
        return this.outLS().users;//url ריק
    },

    getUser(mail) {
    console.log("in user")
    console.log("goog " +this.findUser(mail))
      let temp = this.findUser(mail)//זיהוי מייל
      console.log({t:"temp ",temp});
        return temp;
    },

    getTasks(mail) {
        const users= this.outLS.users; //זיהוי מייל ומשימות
        let user = this.findUser(mail);
        if (user) return user.tasks;
        return null;
    },

    getTask(mail, id) {
        let user=this.findUser(mail); //זיהוי מספר
        let task=this.findTask(user, id);
        return task;
    },


    //post methods
    postUser (user) {
        this._data = this.outLS();
        this._data.users.push(JSON.parse(sessionStorage.getItem("currentUser")));
        this.inLS();
    },


    postTask (mail, task) {//זיהוי מייל
        let user = this.findUser(mail);
        console.log(user);
        user.tasks.push(task);
        console.log(user);
        this.inLS();
    },

    //put method

    putTask (mail, task) {
        console.log("putTask")
        let user = this.findUser(mail);
        let taskToChange = this.findTask(user, task.id);
        console.log(task.id);
        console.log(taskToChange);
        taskToChange.description = task.description;
        this.inLS();
    },

    //delete methods

    deleteTasks (mail) { //זיהוי מייל
        let user= this.findUser(mail);
        console.log(user)
        user.tasks=[];
        this.inLS();
    },

    deleteTask (mail, id) {
        let user= this.findUser(mail); //זיהוי מייל ו-אידי
        console.log("goodin");
        console.log(user);

        for (let i = 0; i< user.tasks.length; ++i){
            if (user.tasks[i].id === id){
                user.tasks.splice(i,1);
            }
        }
        this.inLS();

    },


    //help methods

    outLS () {
        console.log("outLS")
        return JSON.parse(localStorage.getItem("usersData"));
    },

    inLS () {
        localStorage.setItem("usersData",JSON.stringify(this._data));
    },

    findUser (mail) {
        console.log("gh")
        this._data = this.outLS();
        let users = this._data.users;
        console.log(users);
        console.log("hh")
        for(const item of users){
            console.log(item)
            if(mail == item.mail){
                console.log(item)
                return item;
            }
        }
        return null;
    },

    findTask (user, id) {
        console.log("findTask");
        let myuser = this.findUser(user.mail);
        for (item of myuser.tasks){
            if(item.id === id) return item;
            console.log("infindtask")
            console.log(item);
            
        }
        return null;
    }
}

//myapi/dataBase/mail="jkdj"/id=90