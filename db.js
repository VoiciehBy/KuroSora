const mysql = require("mysql2/promise");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "dev"
})

function doQuery(query = "", timeout = 100) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            connection.then(connection => connection.query(query)).then(([rows, fields]) => {
                resolve(rows)
            })
        }, timeout)
    }).catch((err) => {
        console.error(err)
        console.error("Cannot do the query :( ...")
        reject(err)
    })
}

module.exports = {
    getUsers: () => doQuery("SELECT * FROM Users"),
    getUser: (username) => doQuery(`SELECT * FROM USERS WHERE username='${username}'`),
    addUser: (id, login, password, username) => doQuery(`INSERT INTO Users VALUES(${id},'${login}','${password}','${username}');`),
    addMessage: (sender, recipient, content, m_date) => {
        doQuery(`SELECT id FROM Users WHERE username='${sender}'`).then(sender_id => {
            doQuery(`SELECT id FROM Users WHERE username='${recipient}'`).then(recipient_id => {
                doQuery(`INSERT INTO Messages (sender_id, recipient_id, content, m_date) VALUES(${sender_id[0].id},${recipient_id[0].id},'${content}','${m_date}');`)
            })
        })
    }
}