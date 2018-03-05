const express = require('express');

const { check, validationResult } = require('express-validator/check');

const router = express.Router();

const bcrypt = require('bcrypt');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function query(q, values = []) {
  const client = new Client({ connectionString });
  await client.connect();

  let result;

  try {
    result = await client.query(q, values);
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }

  return result;
}

async function comparePasswords(hash, password) {
  const result = await bcrypt.compare(hash, password);

  return result;
}

async function findByUsername(username) {
  const q = 'SELECT * FROM Users WHERE username = $1';

  const result = await query(q, [username]);
  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function findById(id) {
  const q = 'SELECT * FROM Users WHERE id = $1';

  const result = await query(q, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function createUser(username, password, name) {
  const hashedPassword = await bcrypt.hash(password, 11);
  const q = 'INSERT INTO Users (username, password, name) VALUES ($1, $2, $3) RETURNING *';

  const result = await query(q, [username, hashedPassword, name]);

  return result.rows[0];
}

/*
GET skilar síðu (sjá að neðan) af notendum
lykilorðs hash skal ekki vera sýnilegt
*/
router.get('/', (req, res) => {
  // do stuff
});

/*
GET skilar stökum notanda ef til
Lykilorðs hash skal ekki vera sýnilegt
*/
router.get('/:id', (req, res) => {
  // do stuff
});

/*
GET skilar innskráðum notanda (þ.e.a.s. þér)
*/
router.get('/me', (req, res) => {
  // do stuff
});

/*
PATCH uppfærir sendar upplýsingar um notanda fyrir utan notendanafn,
þ.e.a.s. nafn eða lykilorð, ef þau eru gild
*/
router.patch(
  '/me',
  check('password')
    .isLength({ min: 6 })
    .withMessage('Lykilorð verður að vera amk 6 stafir'),
  check('name')
    .isEmpty()
    .withMessage('Nafn má ekki vera tómt'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // do stuff
    }
    // do other stuff
  },
);

/*
POST setur eða uppfærir mynd fyrir notanda í gegnum Cloudinary og skilar slóð
*/
router.get('/me/profile', (req, res) => {
  // do stuff
});

/*
GET skilar síðu af lesnum bókum notanda
*/
router.get('/users/:id/read', (req, res) => {
  // do stuff
});

/*
GET skilar síðu af lesnum bókum innskráðs notanda
*/
router.get('/users/me/read', (req, res) => {
  // do stuff
});

/*
POST býr til nýjan lestur á bók og skilar
*/

router.post(
  '/users/me/read',
  check('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Einkunn verður að vera tala á bilinu 1-5'),
  (req, res) => {
    // do stuff
  },
);

/*
DELETE eyðir lestri bókar fyrir innskráðan notanda*/

router.delete('/users/me/read/:id', (req, res) => {
  // do stuff
});

module.exports = {
  router,
  comparePasswords,
  findByUsername,
  findById,
  createUser,
};
