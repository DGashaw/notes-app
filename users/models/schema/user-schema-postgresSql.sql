CREATE TABLE IF NOT EXISTS users(
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    familyName VARCHAR(255),
    givenName VARCHAR(255),
    middleName VARCHAR(255),
    email VARCHAR(255),
    PRIMARY KEY(username)
);
