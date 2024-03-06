CREATE DATABASE authdb;

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    firstname VARCHAR(200),
    lastname VARCHAR(200),
    username VARCHAR(200),
    password VARCHAR(200),
    email VARCHAR(255),
    role VARCHAR(200),
    UNIQUE (email)
);

ALTER TABLE users
ADD COLUMN role VARCHAR(50);

DELETE FROM users;

SELECT * FROM users;

DROP TABLE users;

CREATE TABLE course (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(200),
    category VARCHAR(200),
    duration VARCHAR(200),
    details VARCHAR(500)
);
