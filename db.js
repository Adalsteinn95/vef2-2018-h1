const {
  Client,
} = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:12345@localhost/vefforritun2';

const bcrypt = require('bcrypt');
const xss = require('xss');
/**
 * Execute an SQL query.
 *
 * @param {string} sqlQuery - SQL query to execute
 * @param {array} [values=[]] - Values for parameterized query
 *
 * @returns {Promise} Promise representing the result of the SQL query
 */
async function query(sqlQuery, values = []) {
  const client = new Client({ connectionString });
  await client.connect();

  let result;

  try {
    result = await client.query(sqlQuery, values);
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  } finally {
    await client.end();
  }

  return result;
}


/**
 * register a user asynchronously.
 *
 * @param {Object} user - user to register
 * @param {string} user.username - username of user
 * @param {string} user.password - password of user
 * @param {string} user.name - name of user
 *
 * @returns {Promise} Promise representing the object result of registered user
 */
async function createUser({ username, password, name } = {}) {
  const hashedPassword = await bcrypt.hash(password, 11);
  const q = 'INSERT INTO Users (username, password, name) VALUES ($1, $2, $3) RETURNING *';

  const result = await query(q, [username, hashedPassword, name]);

  return result.rows[0];
}

/**
 * Read all users asynchronously.
 *
 * @returns {Promise} Promise representing an array of all user object
 */
async function readAllUsers() {
  /* todo útfæra */

  const queryString = 'SELECT * from Users';

  const result = await query(queryString, null);

  return result.rows;
}

/**
 * Read a single user asynchronously.
 *
 * @param {string} username - username of user
 *
 * @returns {Promise} Promise representing the user object or null if not found
 */
async function findByUsername(username) {
  const q = 'SELECT * FROM Users WHERE username = $1';

  const result = await query(q, [username]);
  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

/**
 * Read a single user asynchronously
 *
 * @param {number} id - id of user
 *
 *
 * @returns {Promise} Promise representing the user object or null if not found
 */

async function findById(id) {
  const q = 'SELECT * FROM Users WHERE id = $1';

  const result = await query(q, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

/**
 * Update user asynchronously.
 *
 * @param {number} id - Id of user to update
 * @param {string} username - new username for user
 * @param {string} password - new password for user
 * @param {string} image - new image for user
 *
 * @returns {Promise} Promist representing the new version of the user object
 *
 */
async function alterUser({
  id,
  username,
  password,
  image,
} = {}) {
  /* todo útfæra */

  const values = [xss(username), xss(password), xss(image), xss(id)];

  const queryString = 'UPDATE users SET username = $1, password = $2, image = $3 WHERE id = $4 RETURNING *';

  const result = await query(queryString, values);

  if (result.rowCount === 0) {
    /* not found */
  }

  /* success */
  return result.rows[0];
}

/**
 * Read all Categories asynchronously.
 *
 * @returns {Promise} Promise representing an array of all categories object
 */
async function readAllCategories() {
  /* todo útfæra */

  const queryString = 'SELECT * from categories';

  const result = await query(queryString, null);

  return result;
}

/**
 * Create a category asynchronously.
 *
 * @param {string} name
 *
 * @returns {Promise} Promise representing the object result of creating a category
 */

async function createCategory(name) {
  /* todo útfæra */

  const queryString = 'INSERT INTO Categories(name) VALUES($1) RETURNING *';

  const values = [name];

  const result = await query(queryString, values);

  return result.rows[0];
}

/**
 * Read all Books asynchronously.
 *
 * @param {number}  offset - where to start
 *
 * @returns {Promise} Promise representing an array of all Books object
 */
async function readAllBooks(offset) {
  /* todo útfæra */

  const queryString = 'SELECT * from Books ORDER BY title LIMIT 10 OFFSET $1';

  const result = await query(queryString, [offset]);

  return result;
}

/**
 * Read a single book.
 *
 * @param {number} id - Id of book
 *
 * @returns {Promise} Promise representing the book object or null if not found
 */
async function readOneBook(id) {
  /* todo útfæra */

  const queryString = 'SELECT * from books WHERE id = $1';
  const values = [xss(id)];

  const result = query(queryString, values);

  return result;
}

/**
 * create a book asynchronously.
 *
 * @param {Object} book - book to create
 *
 * @param {string} book.title - Title of book
 * @param {string} book.isbn10 - ISBN10 of book
 * @param {string} book.isbn13 - ISBN10 of book
 * @param {string} book.author - Author of book
 * @param {string} book.description - description of book
 * @param {string} book.category - category of book
 * @param {date}   book.date - date of book
 * @param {number} book.pagecount - number of pages in book
 * @param {string} book.language - language of book
 *
 * @returns {Promise} Promise representing the object result of creating the book
 */
async function createBook({
  title,
  isbn10,
  isbn13,
  author,
  description,
  category,
  published,
  pagecount,
  language,
} = {}) {
  /* todo útfæra */
  const queryString = 'INSERT INTO Books(title, ISBN13, author, description, category, ISBN10, published, pagecount, language) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';

  console.info(pagecount);
  if (pagecount === '') { pagecount = null; }
  if (published === '') { published = null; }

  const values = [xss(title), xss(isbn13), xss(author), xss(description), xss(category), xss(isbn10), xss(published), xss(pagecount), xss(language)];

  const result = await query(queryString, values);
}

/**
 * get read books based on user id
 *
 * @param {number} userID
 *
 * @returns {Promise} Promise representing the array result of book
 */
async function getReadBooks(userID) {
  /* todo */

  const values = [xss(userID)];

  const queryString = 'SELECT * from books WHERE id IN (SELECT bookid from readBooks where userid = $1)';

  const result = await query(queryString, values);

  return result.rows;
}

/**
 * add read book
 *
 * @param {number} userID
 * @param {number} bookID
 * @param {number} rating
 * @param {string} ratingtext
 *
 * @returns {Promise}  Promise representing of book
 */
async function addReadBook({
  userID, bookID, rating, ratingtext,
} = {}) {
  /* to do */

  const values = [xss(userID), xss(bookID), xss(rating), xss(ratingtext)];

  const queryString = 'INSERT into readBooks(userid, bookid, rating) VALUES ($1, $2, $3) RETURNING *';

  const result = await query(queryString, values);

  return result;
}

/**
 * Delete a read book asynchronously.
 *
 * @param {number} userID - Id of user
 * @param {number} bookID - Id of note to delete
 *
 * @returns {Promise} Promise representing the boolean result of deleting the book
 */
async function del(userID, bookID) {
  /* todo útfæra */

  const queryString = 'DELETE FROM readBooks WHERE userID = $1 AND bookID = $2';

  const values = [xss(userID), xss(bookID)];

  const result = await query(queryString, values);

  return result;
}

/**
 * search for books asynchronously.
 *
 * @param {string} title -title of the book
 * @param {string} description -description of the book
 *
 *
 * @returns {Promise} Promise representing array of books
*/
async function search(title, description, offset) {
  const queryString = 'SELECT * from Books WHERE to_tsvector(title) @@ to_tsquery($1) OR to_tsvector(description) @@ to_tsquery($2) ORDER BY title LIMIT 10 OFFSET $3';
  const values = [xss(title), xss(description), offset];

  const result = query(queryString, values);

  return result;
}

module.exports = {
  createUser,
  readAllUsers,
  findById,
  findByUsername,
  alterUser,
  readAllCategories,
  createCategory,
  readAllBooks,
  readOneBook,
  createBook,
  getReadBooks,
  addReadBook,
  del,
  search,
};
