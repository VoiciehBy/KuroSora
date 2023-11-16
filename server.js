const http = require("http");
const path = require("path");
const { readFile } = require("fs");

const db = require("./db")

const hostname = "127.0.0.1";
const port = 3000;

const httpServer = http.createServer();


httpServer.on("request", (req, res) => {
    console.log(req.method, req.url)
    const url = new URL(req.url, `http:${req.headers.host}`)
    res.setHeader("Content-Type", "application/json")

    const request_method = req.method
    const pathname = url.pathname;
    const queryString = url.search;
    const searchParams = new URLSearchParams(queryString);

    switch (request_method) {
        case "GET":
            if (pathname == "/") {
                readFile(path.join(__dirname, "frontend/src/index.html"), "utf-8", (err, result) => {
                    console.log(result);
                    res.setHeader("Content-Type", "text/html");
                    res.end(result);
                })
                /*console.log(`Ok`);
                res.end(`{"Ok": "Ok"}`);*/
            }
            else if (pathname == "/users") {
                console.log(searchParams);
                if (searchParams.has("username")) {
                    let username = searchParams.get("username");

                    db.getUser(username).then(result => {
                        if (result.length == 0) {
                            console.error(`User '${username}' not found...\n`)
                            res.end(`{"txt": "error"}`)
                        }
                        else {
                            let a = JSON.stringify(result[0]);
                            console.log(`User '${username}' exists, that is true...\n`)
                            res.end(a)
                        }
                    })
                }
            }
            break;
        case "PUT":
            if (pathname == "/message") {
                req.on("data", (data) => {
                    obj = JSON.parse(data)
                    console.log(obj)
                    db.addMessage(obj.sender, obj.recipient, obj.content, "CURRENT_DATE()")
                    console.log(`User ${obj.recipient} got message...`)
                    res.write(`{"res": "User ${obj.recipient} got message..."}`)
                    res.end(`User ${obj.recipient} got message...`)
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