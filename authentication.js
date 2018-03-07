const express = require('express');

const { Strategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use(passport.initialize());

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

module.exports = {
  router,
  jwtOptions,
  jwt,
  tokenLifetime,
  requireAuthentication,
};
