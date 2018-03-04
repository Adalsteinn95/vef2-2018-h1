CREATE TABLE Users (
    id           serial PRIMARY KEY,
    userame      VARCHAR(64) NOT NULL,
    password     VARCHAR(64) NOT NULL,
    name         VARCHAR(64) NOT NULL,
    image        VARCHAR(64)
);

CREATE TABLE Categories (
    id           serial PRIMARY KEY,
    name         VARCHAR(64)
);

CREATE TABLE Books (
    id           serial PRIMARY KEY,
    title        VARCHAR(64) NOT NULL,
    ISBN13       VARCHAR(13) NOT NULL,
    author       VARCHAR(64),
    description     text,
    category     serial references Categories(id),
    ISBN10       VARCHAR(10),
    datetime     timestamp,
    pages        int,
    language     VARCHAR(2)
);

CREATE TABLE readBooks(
    id           serial PRIMARY KEY,
    usernID      VARCHAR(64) REFERENCES Users(id),
    bookID       VARCHAR(64) REFERENCES Books(id),
    rating       int,
    ratingtext   VARCHAR(128)

);