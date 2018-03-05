const express = require('express');

const router = express.Router();

/*
GET skilar síðu af bókum
*/
router.get('/', (req, res) => {
  // do stuff
});

/*
POST býr til nýja bók ef hún er gild og skilar
*/
router.post('/', (req, res) => {
  // do stuff
});

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
