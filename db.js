const config = require("./config").db;
const mysql = require("mysql2/promise");

const createConnection = (timeout = 100) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            mysql.createConnection({
                host: config.hostname,
                user: config.user,
                database: config.db_name
            }).then((connection) => {
                console.log("Database connection established, :D...")
                resolve(connection)
            }).catch((err) => {
                //console.error(err)
                console.error("Database connection refused :( ...")
                reject(err)
            })
        })
    }, timeout)
}

const connection = createConnection();


function doQuery(query = "", timeout = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            connection.then(con => con.query(query))
                .catch((err) => {
                    //console.error(err)
                    console.error("Cannot do the query :( ...")
                    reject(err)
                })
                .then(([rows, fields]) => {
                    resolve(rows)
                }).catch((err) => {
                    //console.error(err)
                    console.error("Cannot fetch data :( ...")
                    reject(err)
                })
        }, timeout)
    })
}

function getMessagePromise(sender, recipient) {
    return new Promise((resolve, reject) => {
        doQuery(`SELECT id FROM Users WHERE username='${sender}'`)
            .then(sender_id => {
                if (sender_id[0] === undefined) {
                    reject("Given sender not found...")
                    return
                }
                doQuery(`SELECT id FROM Users WHERE username='${recipient}'`)
                    .then(recipient_id => {
                        if (recipient_id[0] === undefined) {
                            reject("Given recipient not found...")
                            return
                        }
                        doQuery(`SELECT * FROM Messages WHERE sender_id = ${sender_id[0].id} AND recipient_id=${recipient_id[0].id}`)
                            .then((rows) => {
                                resolve(rows)
                            }).catch((err) => {
                                console.error(err)
                                reject(err)
                            })
                    })
            })
    })
}

module.exports = {
    test: () => doQuery(`SELECT id FROM Users WHERE id='1';`),
    getUsers: () => doQuery("SELECT username FROM Users;"),
    getUser: (u) => doQuery(`SELECT * FROM USERS WHERE username='${u}';`),
    getUser_1: (l, p) => doQuery(`SELECT username FROM USERS WHERE login='${l}' AND password='${p}';`),
    getCode: (u_id, t = 'T') => doQuery(`SELECT code FROM CODES WHERE user_id=${u_id} AND temporary='${t}';`),
    addUser: (l, p, u) => doQuery(`INSERT INTO Users (login, password, username, activated) VALUES('${l}','${p}','${u}','F');`),
    addMessage: (sender, recipient, c, d) => {
        doQuery(`SELECT id FROM Users WHERE username='${sender}'`).then(sender_id => {
            doQuery(`SELECT id FROM Users WHERE username='${recipient}'`).then(recipient_id => {
                doQuery(`INSERT INTO Messages (sender_id, recipient_id, content, m_date) VALUES(${sender_id[0].id},${recipient_id[0].id},'${c}','${d}');`)
            })
        })
    },
    addCode: (c, u, t = 'T') => doQuery(`SELECT id FROM USERS WHERE username='${u}';`).then((u_id) => {
        doQuery(`INSERT INTO CODES (code, user_id,temporary) VALUES ('${c}',${u_id[0].id},'${t}');`)
    }),
    deleteCode: (code, t = 'T') => doQuery(`DELETE FROM CODES WHERE code=${code} AND temporary='${t}';`),
    getMessage: (sender, recipient) => getMessagePromise(sender, recipient),
    activateAccount: (u) => doQuery(`UPDATE USERS SET activated='T' WHERE username='${u}';`),
    changePassword: (u, p) => doQuery(`SELECT id FROM USERS WHERE username='${u}';`).then((u_id) => {
        doQuery(`UPDATE USERS SET password='${p}' WHERE id=${u_id[0].id};`)
    })
}