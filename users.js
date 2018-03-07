const express = require('express');

const { check, validationResult } = require('express-validator/check');
const { requireAuthentication, passport } = require('./passport');

const router = express.Router();

const bcrypt = require('bcrypt');
const { Client } = require('pg');
const db = require('./db');

/*
GET skilar síðu (sjá að neðan) af notendum
lykilorðs hash skal ekki vera sýnilegt
*/
router.get('/', async (req, res) => {
  // do stuff
  const result = await db.readAllUsers();

  const finalResult = result.map((i) => {
    const {
      id, username, name, image,
    } = i;
    return {
      id,
      username,
      name,
      image,
    };
  });

  res.send(finalResult);
});

/*
GET skilar innskráðum notanda (þ.e.a.s. þér)
*/
router.get('/me', requireAuthentication, (req, res) => {
  res.json({ data: 'top secret', user: req.user });
});

/*
GET skilar stökum notanda ef til
Lykilorðs hash skal ekki vera sýnilegt
*/
router.get('/:id', (req, res) => {
  // do stuff
});

/*
PATCH uppfærir sendar upplýsingar um notanda fyrir utan notendanafn,
þ.e.a.s. nafn eða lykilorð, ef þau eru gild
*/
router.patch(
  '/me',
  check('password')
    .isLength({
      min: 6,
    })
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
    .isInt({
      min: 1,
      max: 5,
    })
    .withMessage('Einkunn verður að vera tala á bilinu 1-5'),
  (req, res) => {
    // do stuff
  },
);

/*
DELETE eyðir lestri bókar fyrir innskráðan notanda
*/

router.delete('/users/me/read/:id', (req, res) => {
  // do stuff
});

module.exports = router;
