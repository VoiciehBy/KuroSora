const http = require("http");
const db = require("./db")

const hostname = "127.0.0.1";
const port = 3000;
const httpServer = http.createServer();


httpServer.on("request", (req, res) => {
    const request_url = new URL(req.url, `http:${req.headers.host}`)
    res.setHeader("Content-Type", "application/json")

    const request_method = req.method
    const pathname = request_url.pathname;
    const queryString = request_url.search;
    const searchParams = new URLSearchParams(queryString);

    console.log(request_method, request_url)

    switch (request_method) {
        case "GET":
            if (pathname == "/") {
                console.log(`Ok`);
                res.setHeader("Content-Type", "application/json");
                res.end(`{"Ok": "Ok"}`);
            }
            else if (pathname == "/users") {
                db.getUsers().then(result => {
                    console.log(result)
                })
            }
            else if (pathname == "/user") {
                if (searchParams.has("username")) {
                    let username = searchParams.get("username");

                    db.getUser(username).then(result => {
                        if (result.length == 0) {
                            console.error(`User '${username}' not found...\n`)
                            res.end(`{"txt": "error"}`)
                        }
                        else {
                            let userStr = JSON.stringify(result[0]);
                            console.log(`User '${username}' exists, that is true...\n`)
                            res.end(userStr)
                        }
                    })
                }
            }
            else if (pathname == "/user_messages") {
                if (searchParams.has("sender") && searchParams.has("recipient")) {
                    let sender = searchParams.get("sender");
                    let recipient = searchParams.get("recipient");

                    db.getMessage(sender, recipient).then(result => {
                        if (result.length == 0) {
                            console.error(`User '${sender}' not found...\n`)
                            res.end(`{"txt": "error"}`)
                        }
                        else {
                            let resultString = JSON.stringify(result);
                            let numberOfMessages = result.length;
                            console.log(`${recipient} got ${numberOfMessages} messages...`)
                            res.end(resultString)
                        }
                    })
                }
                else {
                    res.end(`{"txt": "error"}`)
                }
            }
            break;
        case "PUT":
            if (pathname == "/message") {
                req.on("data", (data) => {
                    let msgObj = JSON.parse(data)                 
                    let current_date = new Date().toISOString().slice(0,19).replace('T', ' ');    
                    
                    db.addMessage(msgObj.sender, msgObj.recipient, msgObj.content, current_date);
                    console.log(`${msgObj.sender} sent message to ${msgObj.recipient}...`)
                    res.write(`{"res": "${msgObj.sender} sent message to ${msgObj.recipient}..."`)
                    res.end(`"${msgObj.sender} sent message to ${msgObj.recipient}..."`)
                })
            }
            /*else if (pathname == "/register_new_user") {
                console.log("yet to be implemented...")
                res.end("yet to be implemented...\n but Gut")
            }*/
            break;
    }
})


module.exports = {
    initHttpServer: () => {
        httpServer.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}/`);
        });
    }
}