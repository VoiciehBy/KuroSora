CREATE DATABASE dev;

CREATE TABLE Users(
    id int AUTO_INCREMENT,
    login VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    activated CHAR(1) DEFAULT 'F' CHECK (activated IN ('T','F')),
    CONSTRAINT users_pk PRIMARY KEY(id),
    UNIQUE(login),
    UNIQUE(username)
);


INSERT INTO Users (login, password, username, activated) VALUES('test','test','Testovy', 'T');
INSERT INTO Users (login, password, username, activated) VALUES('test1','test1','Testovy1', 'F');

ALTER TABLE Users AUTO_INCREMENT = 2;

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

ALTER TABLE Messages AUTO_INCREMENT = 1;

CREATE TABLE Friendships(
    user_1_id int,
    user_2_id int,
    CONSTRAINT friendships_user_1_id_users_id_fk FOREIGN KEY(user_1_id) REFERENCES Users(id),
    CONSTRAINT friendships_user_2_id_users_id_fk FOREIGN KEY(user_2_id) REFERENCES Users(id),
    CONSTRAINT friendships_pk PRIMARY KEY(user_1_id, user_2_id)
);

ALTER TABLE Friendships AUTO_INCREMENT = 1;

CREATE TABLE Notifications(
    id int AUTO_INCREMENT,
    type VARCHAR(16) NOT NULL,
    user_1_id int,
    user_2_id int,
    CONSTRAINT notifications_pk PRIMARY KEY(id),
    CONSTRAINT notifications_user_1_id_users_id_fk FOREIGN KEY(user_1_id) REFERENCES Users(id),
    CONSTRAINT notifications_user_2_id_users_id_fk FOREIGN KEY(user_2_id) REFERENCES Users(id)
);

ALTER TABLE Notifications AUTO_INCREMENT = 1;

CREATE TABLE Codes(
    code VARCHAR(6),
    user_id int,
    temporary CHAR(1) CHECK (temporary IN ('T','F')),
    CONSTRAINT codes_user_id_users_fk FOREIGN KEY(user_id) REFERENCES Users(id),
    CONSTRAINT codes_pk PRIMARY KEY(code, user_id)
);

/*
DROP TABLE Users
CASCADE CONSTRAINTS;

DROP TABLE Messages
CASCADE CONSTRAINTS;
*/

/*
DROP TABLE Friendships
CASCADE CONSTRAINTS;

DROP TABLE Codes
CASCADE CONSTRAINTS;
*/