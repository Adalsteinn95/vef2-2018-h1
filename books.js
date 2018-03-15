const express = require('express');
const { check, validationResult } = require('express-validator/check');

const db = require('./db');
const { requireAuthentication, passport } = require('./passport');

const router = express.Router();

const { catchErrors } = require('./utils');
/*
GET skilar síðu af bókum
*/

/* munum orugglegea ekki vilja hafa thetta svona */
async function getAllBooks(req, res) {
  const { search, offset } = req.query;

  if (search === '' || search === undefined) {
    const result = await db.readAllBooks(offset);

    res.send({ LIMIT: 10, offset, books: result.rows });
  } else {
    const result = await db.search(search, search, offset);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Úps þetta er vandræðalegt EKKERT FANNST!' });
    } else {
      res.status(201).json({ LIMIT: 10, offset, books: result.rows });
    }
  }
}

/*
POST býr til nýja bók ef hún er gild og skilar
*/
function createBook(req, res) {
  // do stuff
}

/*
GET skilar stakri bók
*/
function getBookById(req, res) {}

/*
PATCH uppfærir bók
*/
function patchBook(req, res) {
  // do stuff
}

router.get('/', catchErrors(getAllBooks));
router.post(
  '/',
  check('title')
    .isEmpty()
    .withMessage('Titill bókar má ekki vera tómur'),
  check('ISBN13')
    .isISBN({ version: 13 })
    .withMessage('ISBN 13 er ekki á réttu formi'),
  check('ISBN10')
    .isISBN({ version: 10 })
    .withMessage('ISBN 10 er ekki á réttu formi'),
  check('pages')
    .isInt({ min: 0 })
    .withMessage('Blaðsíðufjöldi verður að vera tala, stærri en 0'),
  check('language')
    .isLength({ min: 2, max: 2 })
    .withMessage('Tungumál verður að vera tveggja stafa strengur'),
  catchErrors(createBook),
);
router.get('/:id', requireAuthentication, catchErrors(getBookById));
router.patch('/:id', catchErrors(patchBook));
module.exports = router;
