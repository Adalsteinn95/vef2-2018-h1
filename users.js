const express = require('express');

const router = express.Router();

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
router.patch('/me', (req, res) => {
  // do stuff
});

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
router.post('/users/me/read', (req, res) => {
  // do stuff
});

/*
DELETE eyðir lestri bókar fyrir innskráðann notanda
*/
router.delete('/users/me/read/:id', (req, res) => {
  // do stuff
});
