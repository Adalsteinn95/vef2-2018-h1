drop table readBooks;
drop table books;
drop table categories;
drop table users;



CREATE TABLE Users (
    id           serial PRIMARY KEY,
    username     text NOT NULL UNIQUE CHECK (char_length(username) > 2),
    password     text NOT NULL CHECK (char_length(password) > 5),
    name         text NOT NULL CHECK (username <> ''),
    image        VARCHAR(64)
);

CREATE TABLE Categories (
    id           serial PRIMARY KEY,
    name         text UNIQUE NOT NULL
);

CREATE TABLE Books (
    id           serial PRIMARY KEY,
    title        text UNIQUE NOT NULL CHECK (title <> ''),
    ISBN13       VARCHAR(13) UNIQUE NOT NULL,
    author       text,
    description  text,
    category     text NOT NULL,
    ISBN10       VARCHAR(10),
    published    text,
    pagecount    integer CHECK (pagecount > 0),
    language     VARCHAR(2),
    FOREIGN KEY (category) REFERENCES Categories (name)
);

CREATE TABLE readBooks(
    id           serial ,
    userID       serial REFERENCES Users(id),
    bookID       serial REFERENCES Books(id),
    rating       INTEGER    NOT NULL CHECK (rating BETWEEN 1 AND 5),
    ratingtext   text
);

