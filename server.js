const http = require("http");
const db = require("./db")
const config = require("./config").http
const crypto = require("./crypto")

const httpServer = http.createServer();

httpServer.on("request", (req, res) => {
    const request_url = new URL(req.url, `http:${req.headers.host}`)
    const pathname = request_url.pathname;
    const params = new URLSearchParams(request_url.search);
    res.setHeader("Content-Type", "application/json");

    switch (req.method) {
        case "GET":
            if (pathname == "/") {
                db.test().then(() => {
                    res.setHeader("Content-Type", "text/html");
                    res.writeHead(200, http.STATUS_CODES[200])
                    res.end(config.db_ok_html);
                }).catch((err) => {
                    //console.error(err)
                    res.setHeader("Content-Type", "text/html");
                    res.writeHead(503, http.STATUS_CODES[503])
                    res.end(config.db_error_html)
                })
            }
            else if (pathname == "/users") {
                db.getUsers().then(result => {
                    console.log(JSON.stringify(result))
                    res.end(JSON.stringify(result))
                }).catch((err) => {
                    //console.error(err)
                })
            }
            else if (pathname == "/user") {
                if (params.has("username")) {
                    let username = params.get("username");
                    db.getUser(username).then(result => {
                        if (result.length != 0) {
                            console.log(`User '${username}' found...`)
                            res.writeHead(200, http.STATUS_CODES[200])
                            res.end(JSON.stringify(result))
                        }
                        else {
                            console.error(`User '${username}' not found...`)
                            res.writeHead(404, http.STATUS_CODES[404])
                            res.end(JSON.stringify(result))
                        }
                    }).catch((err) => {
                        console.error(err)
                    })
                }
                else if (params.has("login") && params.has("password")) {
                    let login = params.get("login");
                    let password = params.get("password");
                    db.getUser_1(login, password).then(result => {
                        if (result.length != 0) {
                            console.log(`User '${login}' found...\n`)
                            res.writeHead(200, http.STATUS_CODES[200])
                            res.end(JSON.stringify(result))
                        }
                        else {
                            console.error(`User with given credentials not found...\n`)
                            res.writeHead(404, http.STATUS_CODES[404])
                            res.end(JSON.stringify(result))
                        }
                    }).catch((err) => {
                        console.error(err)
                    })
                }
            }
            else if (pathname == "/user_messages") {
                if (params.has("sender") && params.has("recipient")) {
                    let sender = params.get("sender");
                    let recipient = params.get("recipient");
                    if (sender === undefined || recipient === undefined)
                        return
                    db.getMessage(sender, recipient).then(result => {
                        if (result.length != 0)
                            console.log(`'${recipient}' got ${result.length} messages from '${sender}'...`)
                        else
                            console.log(`'${sender}' got no messages from '${recipient}'...`)
                        res.end(JSON.stringify(result))
                    }).catch((err) => {
                        console.error(err)
                        console.error("Messages not found :( ...")
                        res.writeHead(404, http.STATUS_CODES[404])
                        res.end(`{"error": "${err}"}`)
                    })
                }
            }
            else {
                console.error("Bad request...")
                res.writeHead(400, http.STATUS_CODES[400])
                res.end(`{"error": "Bad request 400"}`)
            }
            break;
        case "PUT":
            if (pathname == "/new_message") {
                req.on("data", (data) => {
                    let msgObj = JSON.parse(data)
                    let current_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    db.addMessage(msgObj.sender, msgObj.recipient, msgObj.content, current_date)
                    console.log(`${msgObj.sender}' sent message to '${msgObj.recipient}...`)
                    res.writeHead(201, http.STATUS_CODES[201])
                    res.end(`{"info":}:"'${msgObj.sender}' sent message to '${msgObj.recipient}'..."`)
                })
            }
            else if (pathname == "/new_user") {
                if (params.has("login") && params.has("password") && params.has("username")) {
                    let username = params.get("username");
                    let login = params.get("login");
                    let hash = crypto.genHash(params.get("password"))
                    db.getUser(login, hash, username).then((result) => {
                        if (result === [])
                            db.addUser(login, hash, username).then(() => {
                                console.log(`User '${username}' was registered successfully...`);
                                res.writeHead(201, http.STATUS_CODES[201]);
                                res.end(`{"res": "User '${username}' was registered successfully..."}`);
                            }).catch((err) => {
                                console.error(err);
                                console.error(`User '${username}' registration failed...`);
                                res.end(err);
                            });
                        else {
                            console.error(`User '${username}' registration failed...`);
                            res.writeHead(400, http.STATUS_CODES[400]);
                            res.end(`{"res": "User '${username}' registration failed..."}`);
                        }
                    })
                }
            }
            else {
                console.error("Bad request...")
                res.writeHead(400, http.STATUS_CODES[400])
                res.end(`{"error": "Bad request 400"}`)
            }
            break;
    }
})

httpServer.listen(config.port, config.hostname, () => {
    console.log(`Server running at http://${config.hostname}:${config.port}/`);
    http.get(`http://${config.hostname}:${config.port}/`, (res) => {
        switch (res.statusCode) {
            case 200:
                console.log("DB: Ok", res.statusCode)
                break;
            case 503:
                console.error("DB unavailable...", res.statusCode)
                break;
            default:
                console.log('?', res.statusCode)
                break;
        }
    })
});