const express = require('express');
const { check, validationResult } = require('express-validator/check');

const db = require('./db');

const router = express.Router();

/*
GET skilar síðu af bókum
*/
router.get('/', async (req, res) => {
  // do stuff
  const result = await db.readAllBooks();

  res.send(result.rows);
});

/*
POST býr til nýja bók ef hún er gild og skilar
*/
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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // do stuff
    }
    // do other stuff
  },
);


/*
GET skilar síðu af bókum sem uppfylla leitarskilyrði, sjá að neðan
*/
router.get('/books?search=query', (req, res) => {
  // do stuff
});

/*
GET skilar stakri bók
*/
router.get('/:id', (req, res) => {
  // do stuff
});

/*
PATCH uppfærir bók
*/
router.post('/:id', (req, res) => {
  // do stuff
});

module.exports = router;
