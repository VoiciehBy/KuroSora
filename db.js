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
    getUsers: () => doQuery("SELECT username, activated FROM Users;"),
    getUser: (u) => doQuery(`SELECT id, username, activated FROM USERS WHERE username='${u}';`),
    getUserByHS: (l, p) => doQuery(`SELECT username, activated FROM USERS WHERE login='${l}' AND password='${p}';`),
    getUserById: (i) => doQuery(`SELECT username FROM USERS WHERE id=${i};`),

    getMessage: (sender, recipient) => getMessagePromise(sender, recipient),

    getCode: (u_id, t = 'T') => doQuery(`SELECT code FROM CODES WHERE user_id=${u_id} AND temporary='${t}';`),

    getNotifications: (u, uu) => {
        /*let x = doQuery(`SELECT id FROM Users WHERE username='${u}'`).then(user_1_id => {
            doQuery(`SELECT id FROM Users WHERE username='${uu}'`).then(user_2_id => {
                doQuery(`SELECT * FROM Notifications WHERE user_1_id=${user_1_id[0].id} AND user_2_id=${user_2_id[0].id};`)
            })
        })*/
        return doQuery(`SELECT * FROM Notifications;`);
    },

    addUser: (l, p, u) => doQuery(`INSERT INTO Users (login, password, username, activated) VALUES('${l}','${p}','${u}','F');`),

    addMessage: (sender, recipient, c, d) => {
        return doQuery(`SELECT id FROM Users WHERE username='${sender}'`).then(sender_id => {
            doQuery(`SELECT id FROM Users WHERE username='${recipient}'`).then(recipient_id => {
                doQuery(`INSERT INTO Messages (sender_id, recipient_id, content, m_date) VALUES(${sender_id[0].id},${recipient_id[0].id},'${c}','${d}');`)
            })
        }) //RETURN TODO
    },

    addCode: (c, u, t = 'T') => doQuery(`SELECT id FROM USERS WHERE username='${u}';`).then((u_id) => {
        doQuery(`INSERT INTO CODES (code, user_id,temporary) VALUES ('${c}',${u_id[0].id},'${t}');`)
    }),

    addNotification: (u, uu, t = "FRIEND_REQUEST") => {
        return doQuery(`SELECT id FROM Users WHERE username='${u}'`).then(user_1_id => {
            doQuery(`SELECT id FROM Users WHERE username='${uu}'`).then(user_2_id => {
                doQuery(`INSERT INTO Notifications (user_1_id, user_2_id, type) VALUES(${user_1_id[0].id}, ${user_2_id[0].id}, '${t}');`)
            })
        })
    },

    addFriendship: (u, uu) => {
        return doQuery(`SELECT id FROM Users WHERE username='${u}'`).then(user_1_id => {
            doQuery(`SELECT id FROM Users WHERE username='${uu}'`).then(user_2_id => {
                doQuery(`INSERT INTO Friendships (user_1_id, user_2_id) VALUES(${user_1_id[0].id}, ${user_2_id[0].id});`)
            })
        })
    },

    deleteCode: (code, t = 'T') => doQuery(`DELETE FROM CODES WHERE code=${code} AND temporary='${t}';`),

    activateUser: (u) => doQuery(`UPDATE USERS SET activated='T' WHERE username='${u}';`),
    changePass: (u, p) => doQuery(`SELECT id FROM USERS WHERE username='${u}';`).then((u_id) => {
        doQuery(`UPDATE USERS SET password='${p}' WHERE id=${u_id[0].id};`)
    }),

    deleteFriend: (u, uu) => {
        return doQuery(`SELECT id FROM Users WHERE username='${u}'`).then(user_1_id => {
            doQuery(`SELECT id FROM Users WHERE username='${uu}'`).then(user_2_id => {
                doQuery(`DELETE FROM Friendships WHERE user_1_id=${user_1_id[0].id} AND user_2_id=${user_2_id[0].id};`)
            })
        })
    },
    deleteNotification: (u, uu) => {
        return doQuery(`SELECT id FROM Users WHERE username='${u}'`).then(user_1_id => {
            doQuery(`SELECT id FROM Users WHERE username='${uu}'`).then(user_2_id => {
                doQuery(`DELETE FROM Notifications WHERE user_1_id=${user_1_id[0].id} AND user_2_id=${user_2_id[0].id};`)
            })
        })
    }
}