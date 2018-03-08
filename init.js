const db = require('./db');
const csv = require('csvtojson');

/**
 * add books from csv synchronously
 *
 * @returns {boolean}
 *
 */
async function addBooks(result) {
  const csvFilePath = './data/books.csv';
  const books = [];
  const b = await csv()
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

      return true;
    });

  return b;
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
  const a = await csv()
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
      
      return books;
    });

  return a;
}

async function init() {
  addCategories();

  setTimeout(addBooks, 100);
}


init();
