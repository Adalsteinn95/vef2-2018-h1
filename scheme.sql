CREATE TABLE Users (
    id           serial PRIMARY KEY,
    username      VARCHAR(64) UNIQUE NOT NULL,
    password     VARCHAR(64) NOT NULL,
    name         VARCHAR(64) NOT NULL,
    image        VARCHAR(64)
);

CREATE TABLE Categories (
    id           serial PRIMARY KEY,
    name         text UNIQUE NOT NULL
);

CREATE TABLE Books (
    id           serial PRIMARY KEY,
    title        text UNIQUE NOT NULL,
    ISBN13       VARCHAR(13) UNIQUE NOT NULL,
    author       text,
    description  text,
    category     text,
    ISBN10       VARCHAR(10),
    published    timestamp,
    pagecount    integer,
    language     VARCHAR(2),
    FOREIGN KEY (category) REFERENCES Categories (name)
);

CREATE TABLE readBooks(
    id           serial PRIMARY KEY,
    usernID      VARCHAR(64) REFERENCES Users(id),
    bookID       VARCHAR(64) REFERENCES Books(id),
    rating       int,
    ratingtext   VARCHAR(128)

);
