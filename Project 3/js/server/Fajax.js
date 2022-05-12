console.log("fajax");

class FajaxRequest {

    request = {
        url : "",
        body: {},
        method : ""
    }

    response;
    
    open(method, url, body) {

        this.request.url = url;
        this.request.body = body;
        this.request.method = method;

        return this.send();
    }

    send() {
       this.response = server.chooseMethod(this.request);
       return this.response;
    }

}





