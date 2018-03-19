const db = require('./db');
const csv = require('csvtojson');

/**
 * add Categories from csv synchronously
 *
 * @returns {boolean}
 *
 */
async function addToDatabase() {
  const csvFilePath = './data/books.csv';
  const books = [];
  const a = await csv()
    .fromFile(csvFilePath)
    .on('json', jsonObj => books.push(jsonObj))
    .on('done', async () => {
      /* ugly but it needs to like this we only got 100 connections to server */
      const newBooks = books;

      const categories = books.map(item => item.category);

      const newCategories = Array.from(new Set(categories));
      for (let i = 0; i < newCategories.length; i += 1) {
        // eslint-disable-next-line
        await db.createCategory(newCategories[i]);
      }

      /* ugly but it needs to like this we only got 100 connections to server */
      for (let i = 0; i < newBooks.length; i += 1) {
        // eslint-disable-next-line
        if (isNaN(parseInt(newBooks[i].pagecount, 10))) {
          newBooks[i].pagecount = 0;
        }
        // eslint-disable-next-line
        await db.createBook(newBooks[i]);
      }
      return books;
    });

  return a;
}

async function init() {
  addToDatabase();
}

init();
