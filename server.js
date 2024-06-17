const http = require("http");
const db = require("./db");
const config = require("./config").http;
const crypto = require("./crypto");
const mail = require("./mail");

const httpServer = http.createServer();

httpServer.on("request", (req, res) => {
    const request_url = new URL(req.url, `http:${req.headers.host}`)
    const pathname = request_url.pathname;
    const params = new URLSearchParams(request_url.search);
    res.setHeader("Content-Type", "application/json");

    switch (req.method) {
        case "POST":
            if (pathname === "/login") {
                req.on("data", (data) => {
                    let credentialsObj = JSON.parse(data);
                    let login = credentialsObj.login;
                    let hash = credentialsObj.password;
                    db.getUserByHS(login, hash).then(result => {
                        if (result.length != 0) {
                            console.log(`User '${login}' found...\n`);
                            res.writeHead(200, http.STATUS_CODES[200]);
                        }
                        else {
                            console.error(`User with given credentials not found...\n`);
                            res.writeHead(404, http.STATUS_CODES[404]);
                        }
                        res.end(JSON.stringify(result));
                    }).catch((err) => {
                        console.error(`Getting user with given credentials failed...`);
                        res.writeHead(500, http.STATUS_CODES[500])
                        res.end(`{"error": "${err}"}`);
                    })
                })
            }
            break;
        case "GET":
            if (pathname === "/") {
                db.test().then(() => {
                    res.writeHead(200, http.STATUS_CODES[200]);
                    res.end(`{"info" : "DB: Ok"}`);
                }).catch((err) => {
                    console.error("Establishing database connection failed, :(...");
                    res.writeHead(503, http.STATUS_CODES[503]);
                    res.end(`{"error" : "DB unavailable..."}`); //TODO
                })
            }
            else if (pathname === "/user") {
                if (params.has("username")) {
                    let username = params.get("username");
                    db.getUser(username).then(result => {
                        if (result.length != 0) {
                            console.log(`User '${username}' found...`);
                            res.writeHead(200, http.STATUS_CODES[200]);
                        }
                        else {
                            console.error(`User '${username}' not found...`);
                            res.writeHead(404, http.STATUS_CODES[404]);
                        }
                        res.end(JSON.stringify(result));
                    }).catch((err) => {
                        console.error(`Getting user '${username}' failed...`);
                        res.writeHead(500, http.STATUS_CODES[500]);
                        res.end(`{"error": "${err}"}`);
                    })
                }
                else if (params.has("id")) {
                    let id = params.get("id");
                    db.getUserById(id).then(result => {
                        if (result.length != 0) {
                            console.log(`User found...`)
                            res.writeHead(200, http.STATUS_CODES[200]);
                        }
                        else {
                            console.error(`User not found...`);
                            res.writeHead(404, http.STATUS_CODES[404]);
                        }
                        res.end(JSON.stringify(result))
                    }).catch((err) => {
                        console.error(`Getting user failed...`);
                        res.writeHead(500, http.STATUS_CODES[500]);
                        res.end(`{"error": "${err}"}`);
                    })
                }
            }
            else if (pathname === "/user_messages") {
                if (params.has("sender") && params.has("recipient")) {
                    let sender = params.get("sender");
                    let recipient = params.get("recipient");
                    db.getMessages(sender, recipient).then(result => {
                        if (result.length != 0) {
                            console.log(`'${recipient}' got ${result.length} messages from '${sender}'...`)
                            res.writeHead(200, http.STATUS_CODES[200]);
                            res.end(JSON.stringify(result));
                        }
                        else {
                            console.log(`'${sender}' got no messages from '${recipient}'...`)
                            res.writeHead(200, http.STATUS_CODES[200]);
                            res.end(JSON.stringify({}));
                        }
                    }).catch((err) => {
                        console.error(`Getting messages failed :( ...`);
                        res.writeHead(500, http.STATUS_CODES[500]);
                        res.end(`{"error": "${err}"}`);
                    })
                }
            }
            else if (pathname === "/code") {
                if (params.has("username") && params.has("type") && params.has("code")) {
                    let username = params.get("username");
                    let type = params.get("type");
                    let code = params.get("code");
                    db.getUser(username).then(result => {
                        if (result.length != 0) {
                            let id = result[0].id;
                            let temporary = 'T';
                            console.log(`User '${username}' found...`);
                            if (type === 'r')
                                temporary = 'F';
                            db.getCode(id, temporary).then(result => {
                                if (result[0].code === code) {
                                    if (type === 'r')
                                        console.log(`Recovery code was valid...`);
                                    else
                                        console.log(`Temporary code was valid...`)
                                    res.writeHead(200, http.STATUS_CODES[200]);
                                    res.end(JSON.stringify(result));
                                }
                                else {
                                    if (type === 'r')
                                        console.error(`Recovery code not found :( ...`);
                                    else
                                        console.error(`Temporary code not found :( ...`)
                                    res.writeHead(404, http.STATUS_CODES[404]);
                                    res.end(JSON.stringify({}));
                                }
                            }).catch((err) => {
                                if (type === 'r')
                                    console.error("Getting recovery code failed...")
                                else
                                    console.error("Getting temporary code failed...")
                                res.writeHead(500, http.STATUS_CODES[500])
                                res.end(`{"error": "${err}"}`)
                            })
                        }
                        else {
                            console.error(`User '${username}' not found...`);
                            res.writeHead(404, http.STATUS_CODES[404]);
                            res.end(JSON.stringify(result));
                        }
                    }).catch((err) => {
                        console.error("Checking for user existence failed...")
                        res.writeHead(500, http.STATUS_CODES[500]);
                        res.end(`{"error": "${err}"}`)
                    })
                }
            }
            else if (pathname === "/notification") {
                if (params.has("to") && params.has("type")) {
                    let username = params.get("to");
                    let type = params.get("type");
                    db.getNotification(username, type).then(result => {
                        if (result.length != 0) {
                            console.log("Got notification...");
                            res.writeHead(200, http.STATUS_CODES[200]);
                            res.end(JSON.stringify(result));
                        }
                        else {
                            console.error(`Notification not found...`);
                            res.writeHead(200, http.STATUS_CODES[200]);
                            res.end(JSON.stringify({}));
                        }
                    }).catch((err) => {
                        console.error("Getting notification failed...");
                        res.writeHead(500, http.STATUS_CODES[500]);
                        res.end(`{"error": "${err}"}`);
                    })
                }
            }
            else if (pathname === "/notifications") {
                if (params.has("to")) {
                    let username = params.get("to");
                    db.getNotifications(username).then(result => {
                        if (result.length != 0) {
                            console.log("Got notifications...");
                            res.writeHead(200, http.STATUS_CODES[200]);
                            res.end(JSON.stringify(result));
                        }
                        else {
                            console.error(`No new notifications...`)
                            res.writeHead(200, http.STATUS_CODES[204]);
                            res.end(JSON.stringify({}));
                        }
                    }).catch((err) => {
                        console.error("Getting notifications failed...");
                        res.writeHead(500, http.STATUS_CODES[500]);
                        res.end(`{"error": "${err}"}`);
                    })
                }
            }
            else if (pathname === "/friends") {
                if (params.has("of")) {
                    let username = params.get("of");
                    db.getFriends(username).then(result => {
                        if (result.length != 0) {
                            console.log(`Got friends of '${username}', :D...`);
                            res.writeHead(200, http.STATUS_CODES[200]);
                            res.end(JSON.stringify(result));
                        }
                        else {
                            console.log(`User '${username}' has no friends, :(...`);
                            res.writeHead(200, http.STATUS_CODES[200]);
                            res.end(JSON.stringify({}));
                        }
                    }).catch((err) => {
                        console.error("Getting friends failed, :(...");
                        res.writeHead(500, http.STATUS_CODES[500]);
                        res.end(`{"error": "${err}"}`);
                    })
                }
            }
            else if (pathname === "/friendship") {
                if (params.has("u") && params.has("uu")) {
                    let username = params.get("u");
                    let username_1 = params.get("uu");
                    db.getFriendship(username, username_1).then(result => {
                        if (result.length != 0) {
                            console.log("Got friendship, :D...");
                            res.writeHead(200, http.STATUS_CODES[200]);
                            res.end(JSON.stringify(result));
                        }
                        else {
                            console.log("Friendship not found, :(...");
                            res.writeHead(200, http.STATUS_CODES[200]);
                            res.end(JSON.stringify({}));
                        }
                    }).catch((err) => {
                        console.error("Getting frienship failed, :(...");
                        res.writeHead(500, http.STATUS_CODES[500]);
                        res.end(`{"error": "${err}"}`);
                    })
                }
            }
            else if (pathname === "/templates") {
                if (params.has("of")) {
                    let username = params.get("of");
                    db.getTemplates(username).then(result => {
                        if (result.length != 0) {
                            console.log(`Got templates of '${username}', :D...`);
                            res.writeHead(200, http.STATUS_CODES[200]);
                            res.end(JSON.stringify(result));
                        }
                        else {
                            console.log(`User '${username}' has no templates, :(...`);
                            res.writeHead(200, http.STATUS_CODES[200]);
                            res.end(JSON.stringify({}));
                        }
                    }).catch((err) => {
                        console.error("Getting templates failed, :(...");
                        res.writeHead(500, http.STATUS_CODES[500]);
                        res.end(`{"error": "${err}"}`);
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
            if (pathname === "/new_user") {
                req.on("data", (data) => {
                    let newUserObj = JSON.parse(data);
                    let username = newUserObj.username;
                    let hash = crypto.genHash(newUserObj.password);
                    db.getUser(username).then((result) => {
                        if (result.length != 0) {
                            console.error(`User with given '${username}' exists...`);
                            res.writeHead(403, http.STATUS_CODES[403]);
                            res.end(`{"res": "User with given '${username}' exists..."}`);
                        }
                        else {
                            db.addUser(newUserObj.login, hash, username).then(() => {
                                console.log(`User '${username}' was registered successfully...`);
                                res.writeHead(201, http.STATUS_CODES[201]);
                                res.end(`{"res": "User '${username}' was registered successfully..."}`);
                            }).catch((err) => {
                                console.error(`User '${username}' registration failed...`);
                                res.writeHead(500, http.STATUS_CODES[500]);
                                res.end(`{"error": "${err}"}`);
                            });
                        }
                    })
                })
            }
            else if (pathname === "/new_message") {
                req.on("data", (data) => {
                    let msgObj = JSON.parse(data)
                    let current_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    db.addMessage(msgObj.sender, msgObj.recipient, msgObj.content, current_date)
                    console.log(`${msgObj.sender}' sent message to '${msgObj.recipient}...`)
                    res.writeHead(201, http.STATUS_CODES[201])
                    res.end(`{"info":"'${msgObj.sender}' sent message to '${msgObj.recipient}'..."}`);
                })
            }
            else if (pathname === "/new_code") {
                if (params.has("username") && params.has("type")) {
                    let username = params.get("username");
                    let type = params.get("type");
                    if (type === 'a') {
                        let aCode = crypto.genCode();
                        db.addCode(aCode, username).then(() => {
                            console.log(`Activation code was generated successfully...`);
                            mail.sendAuthMail(aCode, username);
                            res.writeHead(200, http.STATUS_CODES[200]);
                            res.end(`{"res": "Activation code was generated successfully..."}`);
                        }).catch((err) => {
                            console.error("Activation code generation failed...");
                            res.writeHead(500, http.STATUS_CODES[500]);
                            res.end(`{"error": "${err}"}`);
                        })
                    }
                    else if (type === 'r') {
                        let rCode = crypto.genRecoveryCode();
                        db.addCode(rCode, username, 'F').then(() => {
                            console.log(`Recovery code was generated successfully...`);
                            mail.sendAuth_2Mail(rCode, username);
                            res.writeHead(200, http.STATUS_CODES[200]);
                            res.end(`{"res": "Recovery code was generated successfully..."}`);
                        }).catch((err) => {
                            console.error("Recovery code generation failed...");
                            res.writeHead(500, http.STATUS_CODES[500]);
                            res.end(`{"error": "${err}"}`);
                        })
                    }
                    else {
                        let code = crypto.genCode();
                        db.addCode(code, username).then(() => {
                            console.log(`Verfication code was generated successfully...`);
                            mail.sendAuth_1Mail(code, username);
                            res.writeHead(200, http.STATUS_CODES[201]);
                            res.end(`{"res": "Verfication code was generated successfully..."}`);
                        }).catch((err) => {
                            console.error("Verification code generation failed...");
                            res.writeHead(500, http.STATUS_CODES[500]);
                            res.end(`{"error": "${err}"}`);
                        })
                    }
                }
            }
            else if (pathname === "/new_notification") {
                if (params.has("from") && params.has("to")) {
                    let username = params.get("from");
                    let username1 = params.get("to");
                    db.getUser(username).then((result) => {
                        if (result.length != 0) {
                            db.addNotification(username, username1).then(() => {
                                console.log(`Notification was added...`);
                                res.writeHead(201, http.STATUS_CODES[201]);
                                res.end(`{"res": "Notification was added..."}`);
                            }).catch((err) => {
                                console.error(`Adding notification failed...`);
                                res.writeHead(500, http.STATUS_CODES[500]);
                                res.end(`{"error": "${err}"}`)
                            });
                        }
                        else {
                            console.error(`Adding notification failed...`);
                            res.writeHead(400, http.STATUS_CODES[400]);
                            res.end(`{"res": "Adding notification failed..."}`);
                        }
                    })
                }
            }
            else if (pathname === "/new_friend") {
                if (params.has("u") && params.has("uu")) {
                    let username = params.get("u");
                    let username1 = params.get("uu");
                    db.getUser(username).then((result) => {
                        if (result.length != 0) {
                            db.addFriendship(username, username1).then(() => {
                                console.log(`User '${username}' and user '${username1}' became 'friends' successfully...`);
                                res.writeHead(201, http.STATUS_CODES[201]);
                                res.end(`{"res": "User '${username}' and user '${username1}' became 'friends' successfully..."}`);
                            }).catch((err) => {
                                console.error(`User '${username}' and user '${username1}' failed to form friendship...`);
                                res.writeHead(500, http.STATUS_CODES[500]);
                                res.end(`{"error": "${err}"}`)
                            });
                        }
                        else {
                            console.error(`UUser '${username}' and user '${username1}' failed to form friendship...`);
                            res.writeHead(400, http.STATUS_CODES[400]);
                            res.end(`{"res": "User '${username}' and user '${username1}' failed to form friendship..."}`); //TODO REFACTOR
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
        case "PATCH":
            if (pathname === "/user") {
                if (params.has("username")) {
                    let username = params.get("username");
                    req.on("data", (data) => {
                        let payload = JSON.parse(data);
                        if (Object.hasOwn(payload, "password")) {
                            let hash = crypto.genHash(payload.password);
                            db.changePass(payload.username, hash);
                            console.log(`'${payload.username}' changed password successfully...`)
                            res.writeHead(201, http.STATUS_CODES[201])
                            res.end(`{"info":}:"'${payload.username}' changed password successfully..."`)
                        }
                        else {
                            db.activateUser(username).then(() => {
                                console.log(`User '${username}' account was activated successfully...`);
                                res.writeHead(201, http.STATUS_CODES[201]);
                                res.end(`{"res": "User '${username}' account was activated successfully..."}`);
                            }).catch((err) => {
                                console.error(`User '${username}' account activation failed...`);
                                res.end(`{"error": "${err}"}`)
                            })
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
        case "DELETE":
            if (pathname === "/code") {
                if (params.has("v")) {
                    let code = params.get("v");
                    db.deleteCode(code).then(() => {
                        console.log(`Verification code deletion was successful...`)
                        res.writeHead(204, http.STATUS_CODES[204]);
                        res.end(JSON.stringify({}));
                    }).catch((err) => {
                        console.error(`Verification code deletion failed...`);
                        res.writeHead(500, http.STATUS_CODES[500]);
                        res.end(`{"error": "${err}"}`);
                    })
                }
            }
            else if (pathname === "/notification") {
                if (params.has("id")) {
                    let id = params.get("id");
                    db.deleteNotificationById(id).then(() => {
                        console.log("Deleteting notification...");
                        res.writeHead(204, http.STATUS_CODES[204]);
                        res.end(JSON.stringify({}));
                    }).catch((err) => {
                        console.error("Deleteting notification failed...");
                        res.writeHead(500, http.STATUS_CODES[500]);
                        res.end(`{"error": "${err}"}`);
                    })
                }
                else if (params.has("from") && params.has("to")) {
                    let username = params.get("from");
                    let username_1 = params.get("to");
                    db.deleteNotification(username, username_1).then(() => {
                        console.log("Deleteting notification...");
                        res.writeHead(204, http.STATUS_CODES[204]);
                        res.end(JSON.stringify({}));
                    }).catch((err) => {
                        console.error("Deleteting notification failed...");
                        res.writeHead(500, http.STATUS_CODES[500]);
                        res.end(`{"error": "${err}"}`);
                    })
                }
            }
            else if (pathname === "/friend") {
                if (params.has("u") && params.has("uu")) {
                    let username = params.get("u");
                    let username1 = params.get("uu").trim();
                    db.getUser(username).then((result) => {
                        if (result.length != 0) {
                            db.deleteFriend(username, username1).then(() => {
                                console.log(`Friendship was ended...`);
                                res.writeHead(204, http.STATUS_CODES[204]);
                                res.end(JSON.stringify({}));
                            }).catch((err) => {
                                console.error(`Ending friendship failed...`);
                                res.writeHead(500, http.STATUS_CODES[500]);
                                res.end(`{"error": "${err}"}`)
                            });
                        }
                        else {
                            console.error(`User '${username}' not found...`);
                            res.writeHead(404, http.STATUS_CODES[404]);
                            res.end(JSON.stringify(result));
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
        default:
            console.error("Not implemented...")
            res.writeHead(501, http.STATUS_CODES[501])
            res.end(`{"error": "Not implemented 501"}`)
            break;
    }
}) //TODO TO DO REFACTOR CODE REPETITION

httpServer.listen(config.port, config.hostname, () => {
    console.log(`Server running at http://${config.hostname}:${config.port}/`);
    http.get(`http://${config.hostname}:${config.port}/`, (res) => {
        if (res.statusCode === 200) {
            res.on("data", data => {
                console.log(JSON.parse(data).info, res.statusCode);
            })
        }
        else if (res.statusCode === 503) {
            res.on("data", data => {
                console.log(JSON.parse(data).error, res.statusCode);
            })
        }
        else console.log('?', res.statusCode);
    })
});