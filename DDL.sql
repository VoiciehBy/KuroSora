CREATE TABLE Users(
    id int AUTO_INCREMENT,
    login VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    CONSTRAINT users_pk PRIMARY KEY(id),
    UNIQUE(login),
    UNIQUE(username)
);


INSERT INTO Users (login, password, username) VALUES('test','test','Testovy');
INSERT INTO Users (login, password, username) VALUES('test1','test1','Testovy1');
INSERT INTO Users (login, password, username) VALUES('abrozy','qwerty','PanKleks');

DROP TABLE Users
CASCADE CONSTRAINTS;

CREATE TABLE Messages(
    id int AUTO_INCREMENT,
    sender_id int,
    recipient_id int,
    content VARCHAR(255),
    m_date DATETIME(0),
    CONSTRAINT messages_pk PRIMARY KEY(id),
    CONSTRAINT messages_sender_id_users_id_fk FOREIGN KEY(sender_id) REFERENCES Users(id),
    CONSTRAINT messages_recipient_id_users_id_fk FOREIGN KEY(recipient_id) REFERENCES Users(id)
);

DROP TABLE Messages
CASCADE CONSTRAINTS;