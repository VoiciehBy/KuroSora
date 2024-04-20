const http = require("http");
const db = require("./db")
const config = require("./config").http
const crypto = require("./crypto")
const mail = require("./mail")

const httpServer = http.createServer();

httpServer.on("request", (req, res) => {
    const request_url = new URL(req.url, `http:${req.headers.host}`)
    const pathname = request_url.pathname;
    const params = new URLSearchParams(request_url.search);
    res.setHeader("Content-Type", "application/json");

    switch (req.method) {
        case "GET":
            if (pathname == "/") {
                res.setHeader("Content-Type", "text/html");
                db.test().then(() => {
                    res.writeHead(200, http.STATUS_CODES[200]);
                    res.end(config.db_ok_html);
                }).catch((err) => {
                    console.error("Establishing database connection failed, :(...");
                    res.writeHead(503, http.STATUS_CODES[503]);
                    res.end(config.db_error_html);
                })
            }
            else if (pathname === "/users") {
                db.getUsers().then(result => {
                    console.log("Got users...");
                    res.writeHead(200, http.STATUS_CODES[200]);
                    res.end(JSON.stringify(result));
                }).catch((err) => {
                    console.error("Getting users failed...");
                    res.end(`{"error": "${err}"}`);
                })
            }
            else if (pathname === "/user") {
                if (params.has("username")) {
                    let username = params.get("username");
                    db.getUser(username).then(result => {
                        if (result.length != 0) {
                            console.log(`User '${username}' found...`)
                            res.writeHead(200, http.STATUS_CODES[200])
                            res.end(JSON.stringify(result))
                        }
                        else {
                            console.error(`User '${username}' not found 47...`)
                            res.writeHead(404, http.STATUS_CODES[404])
                            res.end(JSON.stringify(result))
                        }
                    }).catch((err) => {
                        console.error(`Getting user '${username}' failed...`);
                        res.end(`{"error": "${err}"}`);
                    })
                }
            }
            else if (pathname === "/handshake") {
                if (params.has("login") && params.has("password")) {
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
                        console.error(`Getting user with given credentials failed...`);
                        res.end(`{"error": "${err}"}`);
                    })
                }
            }
            else if (pathname === "/user_messages") {
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
                        console.error(`Getting messages failed :( ...`);
                        res.end(`{"error": "${err}"}`);
                    })
                }
            }
            else if (pathname === "/code") {
                if (params.has("username") && params.has("code")) {
                    let username = params.get("username");
                    let code = params.get("code");
                    if (username === undefined || code === undefined)
                        return
                    db.getUser(username).then(result => {
                        if (result.length != 0) {
                            let id = result[0].id;
                            console.log(`User '${username}' found...`)
                            db.getCode(id).then(result => {
                                if (result[0].code === code) {
                                    console.log(`Verfication code was valid... 106`)
                                    res.writeHead(200, http.STATUS_CODES[200])
                                    res.end(`{"res": "Verfication code was valid... 108"}`);
                                }
                                else {
                                    console.error(`Verification code not found :( ...`)
                                    res.writeHead(404, http.STATUS_CODES[404])
                                    res.end(`{"error": "${err}"}`)
                                }
                            }).catch((err) => {
                                console.error("Getting verification code failed...")
                                res.end(`{"error": "${err}"}`)
                            })
                        }
                        else {
                            console.error(`User '${username}' not found 128...`)
                            res.writeHead(404, http.STATUS_CODES[404])
                            res.end(JSON.stringify(result))
                        }
                    }).catch((err) => {
                        console.error("Checking for user existence failed...")
                        res.end(`{"error": "${err}"}`)
                    })
                }
            }
            else if (pathname === "/rec_code") {
                if (params.has("username") && params.has("code")) {
                    let username = params.get("username");
                    let code = params.get("code");
                    db.getUser(username).then((result) => {
                        if (result.length != 0) {
                            let id = result[0].id;
                            let activated = result[0].activated;
                            console.log(`User '${username}' found...`)
                            if (activated === 'F') {
                                console.error(`Cannot regenerate password for inactive account`);
                                res.writeHead(403, http.STATUS_CODES[403]);
                                res.end(`{"error": "Cannot regenerate password for inactive account"}`);
                            }
                            else {
                                db.getCode(id, 'F').then(result => {
                                    if (result[0].code === code) {
                                        console.log(`Recovery code was valid, :D...`)
                                        res.writeHead(200, http.STATUS_CODES[200]);
                                        res.end(`{"res": "Recovery codes matched..."}`);
                                    }
                                    else {
                                        console.error(`Recovery code not found :( ...`)
                                        res.writeHead(404, http.STATUS_CODES[404])
                                        res.end(`{"error": "${err}"}`)
                                    }
                                }).catch((err) => {
                                    console.error("Getting recovery code failed...")
                                    res.end(`{"error": "${err}"}`)
                                })
                            }
                        }
                        else {
                            console.error(`User '${username}' not found 171...`)
                            res.writeHead(404, http.STATUS_CODES[404])
                            res.end(JSON.stringify(result))
                        }
                    }).catch((err) => {
                        console.error("Checking for user existence failed...")
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
            if (pathname === "/new_message") {
                req.on("data", (data) => {
                    let msgObj = JSON.parse(data)
                    let current_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    db.addMessage(msgObj.sender, msgObj.recipient, msgObj.content, current_date)
                    console.log(`${msgObj.sender}' sent message to '${msgObj.recipient}...`)
                    res.writeHead(201, http.STATUS_CODES[201])
                    res.end(`{"info":}:"'${msgObj.sender}' sent message to '${msgObj.recipient}'..."`)
                })
            }
            else if (pathname === "/new_user") {
                if (params.has("login") && params.has("password") && params.has("username")) {
                    let username = params.get("username");
                    let login = params.get("login");
                    let hash = crypto.genHash(params.get("password"))
                    db.getUser(username).then((result) => {
                        if (JSON.stringify(result) === JSON.stringify([]))
                            db.addUser(login, hash, username).then(() => {
                                console.log(`User '${username}' was registered successfully...`);
                                res.writeHead(201, http.STATUS_CODES[201]);
                                res.end(`{"res": "User '${username}' was registered successfully..."}`);
                            }).catch((err) => {
                                console.error(`User '${username}' registration failed...`);
                                res.end(`{"error": "${err}"}`)
                            });
                        else {
                            console.error(`User '${username}' a registration failed...`);
                            res.writeHead(400, http.STATUS_CODES[400]);
                            res.end(`{"res": "User '${username}' registration failed..."}`);
                        }
                    })
                }
            }
            else if (pathname === "/new_code") {
                if (params.has("username")) {
                    let username = params.get("username");
                    let code = crypto.genCode();
                    db.addCode(code, username).then(() => {
                        console.log(`Verfication code was generated successfully...`);
                        mail.sendAuthMail("laurel57@ethereal.email", code);
                        res.writeHead(200, http.STATUS_CODES[200]);
                        res.end(`{"res": "Verfication code was generated successfully..."}`);
                    }).catch((err) => {
                        console.error("Verification code generation failed...")
                        res.end(`{"error": "${err}"}`)
                    })
                }
            }
            else if (pathname === "/new_rec_code") {
                if (params.has("username")) {
                    let username = params.get("username");
                    let rCode = crypto.genRecoveryCode();
                    db.addCode(rCode, username, 'F').then(() => {
                        console.log(`Recovery code was generated successfully...`);
                        mail.sendAuth_2Mail("laurel57@ethereal.email", rCode);
                        res.writeHead(200, http.STATUS_CODES[200]);
                        res.end(`{"res": "Recovery code was generated successfully..."}`);
                    }).catch((err) => {
                        console.error("Recovery code generation failed...")
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
        case "PATCH":
            if (pathname === "/user") {
                if (params.has("username") && params.has("password")) {
                    let username = params.get("username");
                    let hash = crypto.genHash(params.get("password"));
                    db.changePassword(username, hash).then(() => {
                        console.log(`Password was changed successfully...`);
                        res.writeHead(201, http.STATUS_CODES[201]);
                        res.end(`{"res": "Password was changed successfully..."}`);
                    }).catch((err) => {
                        console.error(`Password change failed...`);
                        res.end(`{"error": "${err}"}`)
                    })
                }
                else if (params.has("username")) {
                    let username = params.get("username");
                    db.activateAccount(username).then(() => {
                        console.log(`User '${username}' account was activated successfully...`);
                        res.writeHead(201, http.STATUS_CODES[201]);
                        res.end(`{"res": "User '${username}' account was activated successfully..."}`);
                    }).catch((err) => {
                        console.error(`User '${username}' account activation failed...`);
                        res.end(`{"error": "${err}"}`)
                    })
                }
            }
            break;
        case "DELETE":
            if (pathname === "/code")
                if (params.has("v")) {
                    let code = params.get("v");
                    if (code === undefined)
                        return
                    db.deleteCode(code).then(() => {
                        console.log(`Verification code deletion was successful...`)
                        res.writeHead(200, http.STATUS_CODES[200])
                        res.end(`{"res": "Verification code deletion was successful..."}`);
                    }).catch((err) => {
                        console.error(`Verification code deletion failed...`)
                        res.end(`{"error": "${err}"}`);
                    })
                }
            break;
        default:
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