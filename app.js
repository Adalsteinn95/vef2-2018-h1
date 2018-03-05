require('dotenv').config();

const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { Strategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');

const app = express();
const jwt = require('jsonwebtoken');

const books = require('./books');
const users = require('./users');
// const login = require('./login');

app.use(express.json());

app.use('/books', books);
app.use('/users', users.router);
// app.use('/login', login);
app.use(passport.initialize());

const {
  PORT: port = 3000,
  JWT_SECRET: jwtSecret,
  TOKEN_LIFETIME: tokenLifetime = 20,
} = process.env;

if (!jwtSecret) {
  console.error('JWT_SECRET not registered in .env');
  process.exit(1);
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

function requireAuthentication(req, res, next) {
  return passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      const error = info.name === 'TokenExpiredError' ? 'expired token' : 'invalid token';
      return res.status(401).json({ error });
    }

    req.user = user;
    next();
  })(req, res, next);
}

/*
GET skilar síðu af flokkum
*/
app.get('/categories', (req, res) => {
  // færa kannski categories í books?
  // do stuff
});

/*
POST býr til nýjan flokk og skilar
*/
app.post(
  '/categories',
  check('name')
    .isEmpty()
    .withMessage('Nafn á flokki má ekki vera tómt'),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // do stuff
    }
    // do other stuff
  },
);

/*
POST býr til notanda og skilar án lykilorðs hash
*/
app.post(
  '/register',
  check('username')
    .isLength({ min: 3 })
    .withMessage('Notendanafn verður að vera amk 3 stafir'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Lykilorð verður að vera amk 6 stafir'),
  check('name')
    .isEmpty()
    .withMessage('Nafn má ekki vera tómt'),
  (req, res) => {
    const { username = '', password = '', name = '' } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      users.createUser(username, password, name).then((result) => {
        res.status(201).json({ result });
      });
    }
    // do other stuff
  },
);

/*
POST með notendanafni og lykilorði skilar token
*/
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await users.findByUsername(username);
  if (!user) {
    return res.status(401).json({ error: 'No such user' });
  }
  const passwordIsCorrect = await users.comparePasswords(password, user.password);

  if (passwordIsCorrect) {
    const payload = { id: user.id };
    const tokenOptions = { expiresIn: tokenLifetime };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid password' });
});

// eslint-disable-next-line
function notFoundHandler(req, res, next) {
  res.status(404).json({ error: 'Not found' });
}
// eslint-disable-next-line
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  return res.status(500).json({ error: 'Internal server error' });
}

app.use(notFoundHandler);
app.use(errorHandler);

const { PORT: portlisten = 3000, HOST: host = '127.0.0.1' } = process.env;

app.listen(portlisten, () => {
  console.info(`Server running at http://${host}:${port}/`);
});
