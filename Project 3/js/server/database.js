//if(!(usersData in localStorage)) localStorage.setItem("usersData",{users: [],
//teemLeaders: [],})
console.log("gdh")
let database = {

    data: {
        users: [{ mail: "jd", tasks: [{ descripton: "jkjk", id: 1 }] }],
        teemLeaders: [],
    },



    //methods
    //url data/

    get(path) {
        info = this.findNavigation(path);
        console.log(info);
        return info;
    },

    post(path, adding) {
        let mypath = path.split("/");
        if (mypath[mypath.length - 1] === 'users') {
            database.data.users.push(adding);
        }
        if (mypath[mypath.length - 1] === 'tasks') {
            //TODO arrange navigation
            for (const item in database.data.users) {
                if (item.mail === mypath[mypath.length - 2]) {
                    item.tasks.push(adding);
                }
            }
        }
        database.update();
    },

    delete(path) {
        let mypath = path.split("/");
        //TODO arrange navigation
        for (const item of database.data.users) {
            console.log(item);
            if (item.mail === mypath[mypath.length - 2]) {
                console.log("in")
                console.log(item.tasks.length)
                for (let i = 0; i < item.tasks.length; ++i) {
                    if (mypath[mypath.length - 1] == item.tasks[i]) {
                        item.tasks.splice(i, 1);
                        console.log("h")

                    }
                }
            }
        }
        console.log(database.data);
        //search task

        database.update();
    },

    put(path, requestBody) {
        let mypath = path.split("/");
        //TODO arrange navigation
        for (const item in database.data.users.mypath[mypath.length - 2]) {
            if (requestBody.id === item.id) {
                item.description = requestBody.description;
            }
        }
        database.update();

    },

    update(path, data) {

        localStorage.setItem(usersData, database.data);
    },

    findNavigation(path) {
        let mypath = path.split("/");
        let temp = '';
        let dataCurrent = database
        for (const item of mypath) {
            dataCurrent = dataCurrent[item];
            temp = item
        }
        dataCurrent.map(p => p.mail === item)
    },

}

