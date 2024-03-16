const http = require("http");
const db = require("./db")
const config = require("./config")
const crypto = require("./crypto")

const httpServer = http.createServer();


httpServer.on("request", (req, res) => {
    const request_url = new URL(req.url, `http:${req.headers.host}`)
    const pathname = request_url.pathname;
    const queryString = request_url.search;
    const searchParams = new URLSearchParams(queryString);

    console.log(req.method, request_url)
    res.setHeader("Content-Type", "application/json");

    switch (req.method) {
        case "GET":
            if (pathname == "/") {
                console.log(`Ok`);
                res.end(`{"Ok": "Ok"}`);
            }
            else if (pathname == "/users") {
                db.getUsers().then(result => {
                    if (result.length == 0) {
                        console.error("Users not found...\n")
                        res.end(`{"error": "Users not found...\n"}`)
                    }
                    else
                        res.end(JSON.stringify(result))
                })
            }
            else if (pathname == "/user") {
                if (searchParams.has("username")) {
                    let username = searchParams.get("username");

                    db.getUser(username).then(result => {
                        if (result.length == 0) {
                            console.error(`User '${username}' not found...\n`)
                            res.end(`{"error": "User '${username}' not found...\n"}`)
                        }
                        else {
                            console.log(`User '${username}' found...`)
                            res.end(JSON.stringify(result[0]))
                        }
                    })
                }
                else if (searchParams.has("login") && searchParams.has("password")) {
                    let login = searchParams.get("login");
                    let password = searchParams.get("password");

                    db.getUser_1(login, password).then(result => {
                        if (result.length == 0) {
                            console.error(`User '${login}' with login not found...\n`)
                            res.end(`{"error": "User '${login}' with login not found...\n"}`)
                        }
                        else {
                            console.log(`User '${login}' found...\n`)
                            res.end(JSON.stringify(result[0]))
                        }
                    })
                }
            }
            else if (pathname == "/user_messages") {
                if (searchParams.has("sender") && searchParams.has("recipient")) {
                    let sender = searchParams.get("sender");
                    let recipient = searchParams.get("recipient");
                    if (sender == '' || recipient == '')
                        return
                    db.getMessage(sender, recipient).then(result => {
                        if (result.length == 0) {
                            console.error(`'${sender}' got no messages from '${recipient}'...`)
                            res.end(`{"info": "'${sender}' got no messages from '${recipient}'..."}`)
                        }
                        else {
                            let n = result.length;
                            console.log(`'${recipient}' got ${n} messages from '${sender}'...`)
                            res.end(JSON.stringify(result));
                        }
                    })
                }
                else
                    res.end(`{"error": "Search parameters error..."}`)
            }
            break;
        case "PUT":
            if (pathname == "/message") {
                req.on("data", (data) => {
                    let msgObj = JSON.parse(data)
                    let current_date = new Date().toISOString().slice(0, 19).replace('T', ' ');

                    db.addMessage(msgObj.sender, msgObj.recipient, msgObj.content, current_date);
                    console.log(`'${msgObj.sender}' sent message to '${msgObj.recipient}'...`)
                    res.end(`{"res": "'${msgObj.sender}' sent message to '${msgObj.recipient}'..."}`)
                })
            }
            else if (pathname == "/register_new_user") {
                if (searchParams.has("login") && searchParams.has("password") && searchParams.has("username")) {
                    let username = searchParams.get("username");
                    let password = searchParams.get("password");
                    let login = searchParams.get("login");
                    let hash = crypto.genHash(password)
                    db.addUser(login, hash, username);
                    console.log(`User '${username}' was registered successfully...`)
                    res.end(`{"res": "User '${username}' was registered successfully..."}`)
                }
                else {
                    res.end(`{"error": "User '${username}' registration process failed..."}`)
                }
            }
            break;
    }
})

httpServer.listen(config.port, config.hostname, () => {
    console.log(`Server running at http://${config.hostname}:${config.port}/`);
});