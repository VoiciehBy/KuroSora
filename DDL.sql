CREATE TABLE Users(
    id DECIMAL(20,0),
    login VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    CONSTRAINT users_pk PRIMARY KEY(id),
    UNIQUE(login),
    UNIQUE(username)
);


INSERT INTO Users VALUES(1,'test','test','Testovy');
INSERT INTO Users VALUES(2,'test1','test1','Testovy1');

DROP TABLE Users
CASCADE CONSTRAINTS;

CREATE TABLE Messages(
    id int AUTO_INCREMENT,
    sender_id DECIMAL(20,0),
    recipient_id DECIMAL(20,0),
    content VARCHAR(255),
    m_date DATETIME(0),
    CONSTRAINT messages_pk PRIMARY KEY(id),
    CONSTRAINT messages_sender_id_users_id_fk FOREIGN KEY(sender_id) REFERENCES Users(id),
    CONSTRAINT messages_recipient_id_users_id_fk FOREIGN KEY(recipient_id) REFERENCES Users(id)
);

DROP TABLE Messages
CASCADE CONSTRAINTS;