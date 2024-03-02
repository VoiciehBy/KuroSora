const http = require("http");

const db = require("./db")

const hostname = "127.0.0.1";
const port = 3000;
const httpServer = http.createServer();

httpServer.on("request", (req, res) => {
    const request_url = new URL(req.url, `http:${req.headers.host}`)
    const request_method = req.method
    const pathname = request_url.pathname;
    const queryString = request_url.search;
    const searchParams = new URLSearchParams(queryString);

    //console.log(request_method, request_url)

    res.setHeader("Content-Type", "application/json");

    switch (request_method) {
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
                    else {
                        let usersStr = JSON.stringify(result);
                        res.end(usersStr)
                    }
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
                            let userStr = JSON.stringify(result[0]);
                            console.log(`User '${username}' found...`)
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
                            console.error(`'${sender}' got no messages from '${recipient}'...`)
                            res.end(`{"info": "'${sender}' got no messages from '${recipient}'..."}`)
                        }
                        else {
                            let resultString = JSON.stringify(result);
                            let numberOfMessages = result.length;
                            console.log(`'${recipient}' got ${numberOfMessages} messages from '${sender}'...`)
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
                    let current_date = new Date().toISOString().slice(0, 19).replace('T', ' ');

                    db.addMessage(msgObj.sender, msgObj.recipient, msgObj.content, current_date);
                    console.log(`'${msgObj.sender}' sent message to '${msgObj.recipient}'...`)
                    res.end(`{"res": "'${msgObj.sender}' sent message to '${msgObj.recipient}'..."}`)
                })
            }
            else if (pathname == "/register_new_user") {
                if (searchParams.has("username") && searchParams.has("login")) {
                    let username = searchParams.get("username");
                    let login = searchParams.get("username");

                    db.addUser(login, "qwerty", username);
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

httpServer.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});