const express = require('express');

const { check, validationResult } = require('express-validator/check');
const { requireAuthentication, passport } = require('./passport');

const router = express.Router();

const bcrypt = require('bcrypt');
const { Client } = require('pg');
const db = require('./db');
const cloud = require('./cloud');

/* image */ 
const multer  = require('multer');

const upload = multer({ dest: 'data/uploads/' });
 

const { catchErrors } = require('./utils');

/*
GET skilar síðu (sjá að neðan) af notendum
lykilorðs hash skal ekki vera sýnilegt
*/

async function getUsers(req, res) {
  const result = await db.readAllUsers();
  if (result.length === 0) {
    res.status(204).json();
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

  res.json({ finalResult });
}

/*
GET skilar innskráðum notanda (þ.e.a.s. þér)
*/
function getMe(req, res) {
  res.json({ user: req.user });
}

/*
PATCH uppfærir sendar upplýsingar um notanda fyrir utan notendanafn,
þ.e.a.s. nafn eða lykilorð, ef þau eru gild
*/
async function patchUser(req, res) {
  const { id } = req.user;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { name, password, image } = req.body;
    await db.alterUser({
      id,
      name,
      password,
      image,
    });
    return res.status(204).json();
  }
  return res.status(404).json({ errors });
}

/*
GET skilar stökum notanda ef til
Lykilorðs hash skal ekki vera sýnilegt
*/
async function getUserById(req, res) {
  const { id } = req.params;
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
  const result = await cloud.upload(req.file.path);

  res.send({ result });
});

/*
GET skilar síðu af lesnum bókum notanda
*/
function getReadBooks(req, res) {
  // do stuff
}

/*
GET skilar síðu af lesnum bókum innskráðs notanda
*/
function getMyReadBooks(req, res) {
  // do stuff
}

/*
POST býr til nýjan lestur á bók og skilar
*/
function newReadBook(req, res) {
  // do stuff
}

/*
DELETE eyðir lestri bókar fyrir innskráðan notanda
*/
function deleteReadBook(req, res) {
  // do stuff
}

router.get('/', catchErrors(getUsers));
router.get('/me', requireAuthentication, catchErrors(getMe));
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
  requireAuthentication,
  catchErrors(patchUser),
);
router.get('/:id', catchErrors(getUserById));
router.post('/me/profile', catchErrors(setPhoto));
router.get('/users/:id/read', catchErrors(getReadBooks));
router.get('/users/me/read', catchErrors(getMyReadBooks));
router.post(
  '/users/me/read',
  check('rating')
    .isInt({
      min: 1,
      max: 5,
    })
    .withMessage('Einkunn verður að vera tala á bilinu 1-5'),
  catchErrors(newReadBook),
);
router.delete('/users/me/read/:id', catchErrors(deleteReadBook));

module.exports = router;
