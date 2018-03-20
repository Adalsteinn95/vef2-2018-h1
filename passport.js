const jwt = require('jsonwebtoken');
const { Strategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');

const db = require('./db');

const {
  PORT: port = 3000,
  JWT_SECRET: jwtSecret,
  TOKEN_LIFETIME: tokenLifetime = 60000,
} = process.env;

if (!jwtSecret) {
  console.error('JWT_SECRET not registered in .env');
  process.exit(1);
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

async function strat(data, next) {
  const user = await db.findById(data.id);

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
}

passport.use(new Strategy(jwtOptions, strat));

function requireAuthentication(req, res, next) {
  return passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      console.log(err, user, info);
      const error = info.name === 'TokenExpiredError' ? 'expired token' : 'invalid token';
      return res.status(401).json({ error });
    }

    req.user = user;
    next();
  })(req, res, next);
}

function getToken(user) {
  const payload = { id: user.id };
  const tokenOptions = { expiresIn: tokenLifetime };
  const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
  return token;
}

module.exports = {
  requireAuthentication,
  getToken,
  passport,
};
