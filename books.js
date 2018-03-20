const express = require('express');
const {
  check,
  validationResult,
} = require('express-validator/check');

const db = require('./db');
const {
  requireAuthentication,
  passport,
} = require('./passport');

const router = express.Router();

const {
  catchErrors,
} = require('./utils');

const bookValidation = [
  check('title')
    .isLength({
      min: 1,
    })
    .withMessage('Titill bókar má ekki vera tómur'),
  check('isbn13')
    .isISBN(13)
    .withMessage('ISBN 13 er ekki á réttu formi'),
  check('isbn10')
    .isISBN(10)
    .withMessage('ISBN 10 er ekki á réttu formi'),
  check('pagecount')
    .isInt({
      min: 0,
    })
    .withMessage('Blaðsíðufjöldi verður að vera tala, stærri en 0'),
  check('language')
    .isLength({
      min: 2,
      max: 2,
    })
    .withMessage('Tungumál verður að vera tveggja stafa strengur'),
];

/*
GET skilar síðu af bókum
*/

/* munum orugglegea ekki vilja hafa thetta svona */
async function getAllBooks(req, res) {
  const {
    search,
    offset = 0,
  } = req.query;

  const offsets = parseInt(offset, 10);

  if (search === '' || search === undefined) {
    const result = await db.getAllBooks(offset);
    res.send({
      LIMIT: 10,
      offsets,
      books: result.rows,
    });
  } else if (Number.isNaN(offsets)) {
    res.status(401).send({
      error: 'offset must be a number',
    });
  } else {
    const result = await db.search(search, search, offsets);
    if (result.rows.length === 0) {
      res.status(404).json({
        error: 'This is awkward, found was nothing!',
      });
    } else {
      res.status(201).json({
        LIMIT: 10,
        offsets,
        books: result.rows,
      });
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
    return res.status(204).json();
  }
  const errors = validation.array();
  return res.status(404).json({
    errors,
  });
}

/*
GET skilar stakri bók
*/
async function getBookById(req, res) {
  const {
    id,
  } = req.params;
  const validation = validationResult(req);
  if (validation.isEmpty()) {
    const result = await db.getOneBook(id);
    const book = result.rows[0];
    return res.status(200).json(book);
  }
  const error = validation.array()[0].msg;
  return res.status(404).json({
    error,
  });
}
/*
PATCH uppfærir bók
*/
async function patchBook(req, res) {
  const {
    id,
  } = req.params;
  const validation = validationResult(req);

  if (validation.isEmpty()) {
    const result = await db.alterBook(id, req.body);
    return res.status(200).json(result);
  }
  const errors = validation.array();
  return res.status(404).json({
    errors,
  });
}

router.post('/', requireAuthentication, bookValidation, catchErrors(createBook));
router.get('/', catchErrors(getAllBooks));
router.get(
  '/:id',
  check('id')
    .isInt()
    .withMessage('Id þarf að vera tala'),
  catchErrors(getBookById),
);
router.patch(
  '/:id',
  requireAuthentication,
  bookValidation,
  check('id')
    .isInt()
    .withMessage('Id þarf að vera tala'),
  catchErrors(patchBook),
);
module.exports = router;
