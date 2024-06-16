const config = require("./config").db;
const mysql = require("mysql2/promise");

const dotenv = require("dotenv")

dotenv.config()

const createConnection = (timeout = 1000) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            mysql.createConnection({
                host: config.hostname,
                port: config.port,
                user: config.user,
                //password: process.env.DB_PASSWORD,
                database: config.db_name,
            }).then((connection) => {
                console.log("Database connection established, :D...")
                resolve(connection);
            }).catch((err) => {
                console.error("Database connection refused :( ...")
                reject(err);
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
                    console.error("Cannot do the query :( ...")
                    reject(err)
                })
                .then(([rows, fields]) => {
                    resolve(rows)
                }).catch((err) => {
                    console.error("Cannot fetch data :( ...")
                    reject(err)
                })
        }, timeout)
    })
}

module.exports = {
    test: () => doQuery(`SELECT id FROM ${config.users_table} WHERE id='1';`),
    getUser: (u) => doQuery(`SELECT id, username, activated FROM ${config.users_table} WHERE username='${u}';`),
    getUserByHS: (l, p) => doQuery(`SELECT username, activated FROM ${config.users_table} WHERE login='${l}' AND password='${p}';`),
    getUserById: (i) => doQuery(`SELECT username FROM ${config.users_table} WHERE id=${i};`),
    getMessages: (sender, recipient) => new Promise((resolve, reject) => {
        doQuery(`SELECT id FROM ${config.users_table} WHERE username='${sender}'`)
            .then(sender_id => {
                if (sender_id[0] === undefined) {
                    reject("Given sender not found...")
                    return
                }
                doQuery(`SELECT id FROM ${config.users_table} WHERE username='${recipient}'`)
                    .then(recipient_id => {
                        if (recipient_id[0] === undefined) {
                            reject("Given recipient not found...")
                            return
                        }
                        doQuery(`SELECT * FROM ${config.messages_table} WHERE sender_id = ${sender_id[0].id} AND recipient_id=${recipient_id[0].id}`)
                            .then((rows) => {
                                resolve(rows)
                            }).catch((err) => {
                                console.error(err)
                                reject(err)
                            })
                    })
            })
    }),
    getCode: (u_id, t = 'T') => doQuery(`SELECT code FROM ${config.codes_table} WHERE user_id=${u_id} AND temporary='${t}';`),
    getNotification: (u, t) => new Promise((resolve, reject) => { //TODO TO DO SYMETRIC, BUT MUSTN'T HAVE
        doQuery(`SELECT id FROM ${config.users_table} WHERE username='${u}';`)
            .then(result => {
                if (result[0] === undefined) {
                    reject("Given user or type not found...")
                    return
                }
                doQuery(`SELECT * FROM ${config.notifications_table} WHERE (user_1_id=${result[0].id} OR user_2_id=${result[0].id}) AND type='${t}';`)
                    .then((rows) => {
                        resolve(rows)
                    }).catch((err) => {
                        console.error(err)
                        reject(err)
                    })
            })
    }),
    getNotifications: (u) => new Promise((resolve, reject) => {
        doQuery(`SELECT id FROM ${config.users_table} WHERE username='${u}'`)
            .then(result => {
                if (result[0] === undefined) {
                    reject("Given user not found...")
                    return
                }
                doQuery(`SELECT * FROM ${config.notifications_table} WHERE user_2_id=${result[0].id};`)
                    .then((rows) => {
                        resolve(rows)
                    }).catch((err) => {
                        console.error(err)
                        reject(err)
                    })
            })
    }),
    getFriends: (u) => new Promise((resolve, reject) => {
        doQuery(`SELECT id FROM ${config.users_table} WHERE username='${u}';`)
            .then(result => {
                if (result[0] === undefined) {
                    reject("Given user not found...")
                    return
                }
                doQuery(`SELECT user_1_id, user_2_id FROM ${config.friendships_table} WHERE user_1_id=${result[0].id} OR user_2_id=${result[0].id};`)
                    .then(ids => {
                        if (ids[0] === undefined)
                            resolve([]);
                        else
                            doQuery(`SELECT username FROM ${config.users_table} WHERE id IN (${ids.map(x => x.user_1_id)},${ids.map(x => x.user_2_id)});`)
                                .then((rows) => {
                                    resolve(rows)
                                }).catch((err) => {
                                    console.error(err)
                                    reject(err)
                                })
                    })
            })
    }),
    getFriendship: (u, uu) => new Promise((resolve, reject) => {
        doQuery(`SELECT id FROM ${config.users_table} WHERE username='${u}';`)
            .then(r => {
                if (r[0] === undefined) {
                    reject("Given user not found...")
                    return
                }
                doQuery(`SELECT id FROM ${config.users_table} WHERE username='${uu}';`)
                    .then(rr => {
                        if (rr[0] === undefined) {
                            reject("Given user not found...")
                            return
                        }
                        let i = r[0].id;
                        let ii = rr[0].id;
                        if (i <= ii)
                            doQuery(`SELECT user_1_id, user_2_id FROM ${config.friendships_table} WHERE user_1_id=${i} AND user_2_id=${ii};`)
                                .then((rows) => {
                                    resolve(rows)
                                }).catch((err) => {
                                    console.error(err)
                                    reject(err)
                                })
                        else
                            doQuery(`SELECT user_1_id, user_2_id FROM ${config.friendships_table} WHERE user_1_id=${ii} AND user_2_id=${i};`)
                                .then((rows) => {
                                    resolve(rows)
                                }).catch((err) => {
                                    console.error(err)
                                    reject(err)
                                })
                    })
            })
    }),
    getTemplates: (u) => new Promise((resolve, reject) => {
        doQuery(`SELECT id FROM ${config.users_table} WHERE username='${u}';`)
            .then(result => {
                if (result[0] === undefined) {
                    reject("Given user not found...")
                    return
                }
                doQuery(`SELECT * FROM ${config.templates_table} WHERE owner_id=${result[0].id};`)
                    .then((rows) => {
                        resolve(rows)
                    }).catch((err) => {
                        console.error(err)
                        reject(err)
                    })
            })
    }),
    addUser: (l, p, u) => doQuery(`INSERT INTO ${config.users_table} (login, password, username, activated) VALUES('${l}','${p}','${u}','F');`),
    addMessage: (sender, recipient, c, d) => {
        return doQuery(`SELECT id FROM ${config.users_table} WHERE username='${sender}'`).then(sender_id => {
            doQuery(`SELECT id FROM ${config.users_table} WHERE username='${recipient}'`).then(recipient_id => {
                doQuery(`INSERT INTO ${config.messages_table} (sender_id, recipient_id, content, m_date) VALUES(${sender_id[0].id},${recipient_id[0].id},'${c}','${d}');`)
            })
        })
    },
    addCode: (c, u, t = 'T') => doQuery(`SELECT id FROM ${config.users_table} WHERE username='${u}';`).then((u_id) => {
        doQuery(`INSERT INTO ${config.codes_table} (code, user_id,temporary) VALUES ('${c}',${u_id[0].id},'${t}');`)
    }),
    addNotification: (u, uu, t = "FRIEND_REQUEST") => {
        return doQuery(`SELECT id FROM ${config.users_table} WHERE username='${u}'`).then(user_1_id => {
            doQuery(`SELECT id FROM ${config.users_table} WHERE username='${uu}'`).then(user_2_id => {
                doQuery(`INSERT INTO ${config.notifications_table} (user_1_id, user_2_id, type) VALUES(${user_1_id[0].id}, ${user_2_id[0].id}, '${t}');`)
            })
        })
    },
    addFriendship: (u, uu) => {
        return doQuery(`SELECT id FROM ${config.users_table} WHERE username='${u}'`).then(user_1_id => {
            doQuery(`SELECT id FROM ${config.users_table} WHERE username='${uu}'`).then(user_2_id => {
                let i = user_1_id[0].id;
                let ii = user_2_id[0].id;
                if (i <= ii)
                    doQuery(`INSERT INTO ${config.friendships_table} (user_1_id, user_2_id) VALUES(${i}, ${ii});`);
                else
                    doQuery(`INSERT INTO ${config.friendships_table} (user_1_id, user_2_id) VALUES(${ii}, ${i});`);
            })
        })
    },
    activateUser: (u) => doQuery(`UPDATE ${config.users_table} SET activated='T' WHERE username='${u}';`),
    changePass: (u, p) => doQuery(`SELECT id FROM ${config.users_table} WHERE username='${u}';`).then((u_id) => {
        doQuery(`UPDATE ${config.users_table} SET password='${p}' WHERE id=${u_id[0].id};`)
    }),
    deleteCode: (code, t = 'T') => doQuery(`DELETE FROM ${config.codes_table} WHERE code=${code} AND temporary='${t}';`),
    deleteFriend: (u, uu) => {
        return doQuery(`SELECT id FROM ${config.users_table} WHERE username='${u}'`).then(user_1_id => {
            doQuery(`SELECT id FROM ${config.users_table} WHERE username='${uu}'`).then(user_2_id => {
                let i = user_1_id[0].id;
                let ii = user_2_id[0].id;
                if (i <= ii)
                    doQuery(`DELETE FROM ${config.friendships_table} WHERE user_1_id=${i} AND user_2_id=${ii};`)
                else
                    doQuery(`DELETE FROM ${config.friendships_table} WHERE user_1_id=${ii} AND user_2_id=${i};`)
            })
        })
    },
    deleteNotificationById: (i) => doQuery(`DELETE FROM ${config.notifications_table} WHERE id=${i};`),
    deleteNotification: (u, uu) => {
        return doQuery(`SELECT id FROM ${config.users_table} WHERE username='${u}'`).then(user_1_id => {
            doQuery(`SELECT id FROM ${config.users_table} WHERE username='${uu}'`).then(user_2_id => {
                doQuery(`DELETE FROM ${config.notifications_table} WHERE user_1_id=${user_1_id[0].id} AND user_2_id=${user_2_id[0].id};`)
            })
        })
    }
}