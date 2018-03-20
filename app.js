require('dotenv').config();

const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { Strategy, ExtractJwt } = require('passport-jwt');

const app = express();
const jwt = require('jsonwebtoken');

const books = require('./books');
const users = require('./users');
const db = require('./db');
const xss = require('xss');

const { requireAuthentication, getToken, passport } = require('./passport');

const { catchErrors } = require('./utils');

app.use(express.json());

app.use(passport.initialize());
app.use('/books', books);
app.use('/users', users);

/*
GET skilar síðu af flokkum
*/
async function getCategories(req, res) {
  const {
    offset = 0,
  } = req.query;

  const offsets = parseInt(offset, 10);

  if (Number.isNaN(offsets)) {
    res.status(401).send({
      error: 'offset must be a number',
    });
  } else {
    const categories = await db.readAllCategories(offsets);

    if (categories.length > 0) {
      return res.status(200).json({ LIMIT: 10, offsets, categories });
    }
    return res.status(404).json({ error: 'This is awkward, found was nothing!' });
  }
}
/*
POST býr til nýjan flokk og skilar
*/
async function createCategory(req, res) {
  const { name = '' } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(i => ({ field: i.param, message: i.msg }));
    return res.status(404).json({ errorMessages });
  }
  return db.createCategory(xss(name).toString()).then(result => res.status(201).json({ result }));
}

/*
POST býr til notanda og skilar án lykilorðs hash
*/
async function registerUser(req, res) {
  const { username = '', password = '', name = '' } = req.body;
  const data = {
    username: xss(username).toString(),
    password: xss(password).toString(),
    name: xss(name).toString(),
  };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(i => ({ field: i.param, message: i.msg }));
    return res.status(404).json({ errorMessages });
  }

  return db.createUser(data).then(result => res.status(201).json({ result }));
}

/*
POST með notendanafni og lykilorði skilar token
*/
async function loginUser(req, res) {
  const { username, password } = req.body;

  const user = await db.findByUsername(username.toString());
  if (!user) {
    return res.status(401).json({ error: 'No such user' });
  }
  const passwordIsCorrect = await db.comparePasswords(password.toString(), user.password);

  if (passwordIsCorrect) {
    const token = getToken(user);
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid password' });
}

async function init(req, res) {
  res.json({
    authentication: {
      register: '/register',
      login: '/login',
    },
    books: {
      books: '/books',
      book: '/book/{id}',
    },
    categories: '/categories',
    users: {
      users: '/users',
      user: '/users/{id}',
      read: '/users/{id}/read',
    },
    me: {
      me: '/users/me',
      profile: '/users/me/profile',
      read: '/users/me/read',
    },
  });
}
app.get('/',catchErrors(init));
app.get('/categories', catchErrors(getCategories));
app.post(
  '/categories',
  check('name')
    .isLength({ min: 1 })
    .withMessage('Nafn á flokki má ekki vera tómt'),
  requireAuthentication,
  catchErrors(createCategory),
);
app.post(
  '/register',
  check('username')
    .isLength({ min: 3 })
    .withMessage('Notendanafn verður að vera amk 3 stafir'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Lykilorð verður að vera amk 6 stafir'),
  check('name')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),
  catchErrors(registerUser),
);
app.post('/login', catchErrors(loginUser));

// eslint-disable-next-line
function notFoundHandler(req, res, next) {
  res.status(404).json({ error: 'Not found' });
}
// eslint-disable-next-line
function errorHandler(err, req, res, next) {

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  return res.status(500).json({ error: 'Internal server error' });
}

app.use(notFoundHandler);
app.use(errorHandler);

const { PORT: portlisten = 3000, HOST: host = '127.0.0.1' } = process.env;

app.listen(portlisten, () => {
  console.info(`Server running at http://${host}:${portlisten}/`);
});
