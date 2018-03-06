const db = require('./db');
const csv = require('csvtojson');

/**
 * add books from csv synchronously
 *
 * @returns {boolean}
 *
 */
async function addBooks() {
  const csvFilePath = './data/books.csv';
  const books = [];
  csv()
    .fromFile(csvFilePath)
    .on('json', (jsonObj) => {
      books.push(jsonObj);
    })
    .on('done', async () => {
      /* ugly but it needs to like this we only got 100 connections to server */
      for (let i = 0; i < books.length; i += 1) {
        // eslint-disable-next-line
        await db.createBook(books[i]);
      }
    });
}


/**
 * add Categories from csv synchronously
 *
 * @returns {boolean}
 *
 */
async function addCategories() {
  const csvFilePath = './data/books.csv';
  let books = [];
  csv()
    .fromFile(csvFilePath)
    .on('json', (jsonObj) => {
      books.push(jsonObj.category);
    })
    .on('done', async () => {
      /* ugly but it needs to like this we only got 100 connections to server */
      books = Array.from(new Set(books));
      for (let i = 0; i < books.length; i += 1) {
        // eslint-disable-next-line
        await db.createCategory(books[i]);
      }
    });
}

async function init() {
  await addCategories();
  await addBooks();
}

init();
