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
    ISBN10       VARCHAR(10),
    author       VARCHAR(64),
    descripe     text,
    category     serial references Categories(id),
    datetime     timestamp,
    pages        int,
    language     VARCHAR(2)
);

CREATE TABLE readBooks(
    authentication     VARCHAR(64),
    userame      VARCHAR(64) REFERENCES Users(id),
    book         VARCHAR(64) REFERENCES Books(id),
    rating       int,
    ratingtext   VARCHAR(128)

);
date timestamp with time zone not null default current_timestamp