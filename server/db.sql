CREATE DATABASE authdb;

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    firstname VARCHAR(200),
    lastname VARCHAR(200),
    username VARCHAR(200),
    password VARCHAR(200),
    email VARCHAR(255),
    role VARCHAR(50),
    UNIQUE (email)
);

ALTER TABLE users
ADD COLUMN role VARCHAR(50);

DELETE FROM users;

SELECT * FROM users;

DROP TABLE users;
