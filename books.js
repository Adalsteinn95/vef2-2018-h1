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
  const { search, page } = req.query;

  const pages = parseInt(page, 10);

  let number = 0;
  for (let i = 0; i < pages; i += 1) {
    number += 10;
  }
  if (search === '' || search === undefined) {
    const result = await db.readAllBooks(number);

    res.send({ LIMIT: 10, number, books: result.rows });
  } else {
    const result = await db.search(search, search, number);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Úps þetta er vandræðalegt EKKERT FANNST!' });
    } else {
      res.status(201).json({ LIMIT: 10, number, books: result.rows });
    }
  }
}

/*
POST býr til nýja bók ef hún er gild og skilar
*/
async function createBook(req, res) {
  const validation = validationResult(req);

  if (validation.isEmpty()) {
    const result = await db.createBook(req.body);
    console.log(result);
    return res.status(204).json();
  }
  // console.log('ping');
  const errors = validation.array();
  return res.status(404).json({ errors });
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

router.post(
  '/',
  check('title')
    .isLength({ min: 1 })
    .withMessage('Titill bókar má ekki vera tómur'),
  check('isbn13')
    .isISBN(13)
    .withMessage('ISBN 13 er ekki á réttu formi'),
  check('isbn10')
    .isISBN(10)
    .withMessage('ISBN 10 er ekki á réttu formi'),
  check('pagecount')
    .isInt({ min: 0 })
    .withMessage('Blaðsíðufjöldi verður að vera tala, stærri en 0'),
  check('language')
    .isLength({ min: 2, max: 2 })
    .withMessage('Tungumál verður að vera tveggja stafa strengur'),
  catchErrors(createBook),
);
router.get('/', catchErrors(getAllBooks));
router.get('/:id', requireAuthentication, catchErrors(getBookById));
router.patch('/:id', catchErrors(patchBook));
module.exports = router;
