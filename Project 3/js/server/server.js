console.log("server");

const server = {

    response: {
        statusCode: 0,
        statusText: "",
        readyState: 1,
        body: {},
    },

    get(request) {
        this.response.readyState = 3;
        console.log("request" + request.url)
        let mail = pathMail(request.url);
        console.log(mail)
        console.log(mail)
        if (request.url.match(/dataBase$/i)) {
            this.response.body = DBapi.getAllusers();
        } else if (request.url.match(/tasks=90$/i)) {
            console.log("good");
            this.response.body = DBapi.getTasks(mail);
        } else if (mail.match(/@\w+.\w+$/i)) {
            console.log("go");
            console.log(mail)
            let temp = DBapi.getUser(mail);
            console.log(temp);
            this.response.body = temp;
        
        } else if (request.url.match(/\d+$/i)) {
            this.response.body = DBapi.getTask(mail, pathId(request.url))
        }
        if (!this.response.body) throw "not found";
    },

    post(request) {
        console.log(request)
        this.response.readyState = 3;
        console.log(request.url.match(/@/))
        if (request.url.match(/dataBase$/i)) {
            DBapi.postUser(JSON.parse(sessionStorage.getItem("currentUser")));
        } else if (request.url.match(/@/)) {
            console.log("in");
            DBapi.postTask(pathMail(request.url), request.body);
        }

    },

    put(request) {
        this.response.readyState = 3;
        if (request.url.match(/@/i)) {
            console.log(pathMail(request.url));
            console.log(request.body);
            DBapi.putTask(pathMail(request.url), request.body);
        }
    },

    delete(request) {
        this.response.readyState = 3;
        if (request.url.match(/@\w+.\w+$/i)) {
            DBapi.deleteTasks(pathMail(request.url));
        } else if (request.url.match(/\d+$/i)) {
            DBapi.deleteTask(pathMail(request.url), pathId(request.url));
        }
    },

    chooseMethod(request) {
        this.response.readyState = 2;
        try {
            switch (request.method) {
                case "GET": { this.get(request); break; }
                case "POST": { this.post(request); break; }
                case "PUT": { this.put(request); break; }
                case "DELETE": { this.delete(request); break; }
            }


            this.response.readyState = 4;
            this.response.statusCode = 200;
            this.response.statusText = "ok";
        }

        catch (e) {
            console.log("catch")
            this.response.readyState = 4;
            this.response.statusCode = 400;
            this.response.statusText = "not found";
        }


        return this.response;
    }


}

function pathMail(path) {

    let pathMail;
    if (path.match(/\d$/)) {
        pathMail = path.slice(path.match(/=/).index + 1, path.match(/([^\/]*)$/).index - 1);
    } else {
        pathMail = path.slice(path.match(/=/).index + 1);

    }

    return pathMail;
}

function pathId(path) {
    let pathId = path.match(/([^\/]*)$/)[0];
    return Number(pathId.slice(pathId.match(/=/).index + 1));
}