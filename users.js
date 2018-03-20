const express = require('express');

const { check, validationResult } = require('express-validator/check');
const { requireAuthentication, passport } = require('./passport');

const router = express.Router();

const bcrypt = require('bcrypt');
const { Client } = require('pg');
const db = require('./db');
const cloud = require('./cloud');
const xss = require('xss');
/* image */
const multer = require('multer');

const upload = multer({});

const { catchErrors } = require('./utils');

/*
GET skilar síðu (sjá að neðan) af notendum
lykilorðs hash skal ekki vera sýnilegt
*/

async function getUsers(req, res) {
  const result = await db.readAllUsers();
  if (result.length === 0) {
    return res.status(204).json();
  }
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

  return res.json(finalResult);
}

/*
GET skilar innskráðum notanda (þ.e.a.s. þér)
*/
async function getMe(req, res) {
  const {
    id, name, username, profile,
  } = req.user;
  return res.json({
    id,
    name,
    username,
    profile,
  });
}

/*
PATCH uppfærir sendar upplýsingar um notanda fyrir utan notendanafn,
þ.e.a.s. nafn eða lykilorð, ef þau eru gild
*/
async function patchUser(req, res) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { id } = req.user;
    const { name, password } = req.body;
    await db.alterUser({
      id,
      name: xss(name.toString()),
      password: xss(password.toString()),
    });
    return res.status(204).json();
  }
  return res.status(404).json(errors.array());
}

/*
GET skilar stökum notanda ef til
Lykilorðs hash skal ekki vera sýnilegt
*/
async function getUserById(req, res) {
  const { id } = req.params;
  if (typeof id !== 'number') {
    return res.status(404).json({ error: 'Notandi fannst ekki' });
  }
  const user = await db.findById(id);
  if (user) {
    return res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      image: user.image,
    });
  }
  return res.status(404).json({ error: 'Notandi fannst ekki' });
}

/*
POST setur eða uppfærir mynd fyrir notanda í gegnum Cloudinary og skilar slóð
*/
router.post('/me/profile', upload.single('image'), async (req, res) => {
  // do stuff

  const { file: { buffer } = {} } = req;

  if (!buffer) {
    return res.send('BIG error');
  }
  const result = await cloud.upload(buffer);
  return res.send({ result });
});

/*
GET skilar síðu af lesnum bókum notanda
*/
async function getReadBooks(req, res) {
  const { id } = req.param;
  const books = await db.getReadBooks(id);
  if (books) {
    return res.status(200).json(books);
  }
  return res.status(404);
}

/*
GET skilar síðu af lesnum bókum innskráðs notanda
*/
async function getMyReadBooks(req, res) {
  const { id } = req.user;
  const books = await db.getReadBooks(id);
  if (books) {
    return res.status(200).json(books);
  }
  return res.status(404);
}

/*
POST býr til nýjan lestur á bók og skilar
*/

async function newReadBook(req, res) {
  const errors = validationResult(req);
  const { bookID = '', rating = '', ratingtext = '' } = req.body;
  if (errors.isEmpty()) {
    const { id: userID } = req.user;

    const result = await db.addReadBook({
      userID,
      bookID,
      rating,
      ratingtext,
    });
    return res.status(200).json(result);
  }
  return res.status(404);
}

/*
DELETE eyðir lestri bókar fyrir innskráðan notanda
*/
async function deleteReadBook(req, res) {
  const { id: bookID } = req.params;
  const { id } = req.user;
  console.log(id, bookID);
  const result = await db.del(id, bookID);
  if (result) {
    return res.status(204).json();
  }
  return res.status(404);
}

router.get('/', requireAuthentication, catchErrors(getUsers));
router.get('/me', requireAuthentication, catchErrors(getMe));
router.patch(
  '/me',
  check('password')
    .isLength({
      min: 6,
    })
    .withMessage('Lykilorð verður að vera amk 6 stafir'),
  check('name')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),
  requireAuthentication,
  catchErrors(patchUser),
);
router.get('/me/read', requireAuthentication, catchErrors(getMyReadBooks));
router.post(
  '/me/read',
  requireAuthentication,
  check('rating')
    .isInt({
      min: 1,
      max: 5,
    })
    .withMessage('Einkunn verður að vera tala á bilinu 1-5'),
  catchErrors(newReadBook),
);
router.delete('/me/read/:id', requireAuthentication, catchErrors(deleteReadBook));
router.get('/:id', requireAuthentication, catchErrors(getUserById));
// router.post('/me/profile', catchErrors(setPhoto));
router.get('/:id/read', requireAuthentication, catchErrors(getReadBooks));

module.exports = router;
