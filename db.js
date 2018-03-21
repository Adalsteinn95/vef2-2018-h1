require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const { Client } = require('pg');

const bcrypt = require('bcrypt');
const xss = require('xss');
/**
 * Execute an SQL query
 *
 * @param {string} sqlQuery - SQL query to execute
 * @param {array} [values=[]] - Values for parameterized query
 *
 * @returns {Promise} Promise representing the result of the SQL query
 */
async function query(sqlQuery, values = []) {
  const client = new Client({
    connectionString,
  });
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

async function comparePasswords(hash, password) {
  const result = await bcrypt.compare(hash, password);

  return result;
}

/**
 * Read all users asynchronously.
 *
 * @returns {Promise} Promise representing an array of all user object
 */
async function readAllUsers() {
  /* todo útfæra */

  const queryString = 'SELECT * from Users';

  console.info(queryString);
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
  const q =
    'INSERT INTO Users (username, password, name) VALUES ($1, $2, $3) RETURNING username,name';

  const check = await findByUsername(username);

  if (check) {
    return null;
  }

  const result = await query(q, [username, hashedPassword, name]);
  return result.rows[0];
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
 * @param {string} name - new name for user
 * @param {string} password - new password for user
 *
 * @returns {Promise} Promise representing the new version of the user object
 *
 */
async function alterUser({ id = null, name = null, password = null } = {}) {
  /* todo útfæra */
  const hashedPassword = await bcrypt.hash(password, 11);
  const values = [xss(name), xss(hashedPassword), xss(id)];

  const queryString =
    'UPDATE users SET name = COALESCE($1, name), password = COALESCE($2, password) WHERE id = $3 RETURNING *';

  const result = await query(queryString, values);

  if (result.rowCount === 0) {
    return null;
  }

  /* success */
  return result.rows[0];
}

/**
 * Update user image asynchronously.
 *
 * @param {number} id - Id of user to update
 * @param {string} image - new image for user
 *
 * @returns {Promise} Promise representing the new version of the user object
 *
 */
async function alterUserImage({ image, id } = {}) {
  const values = [xss(image), xss(id)];

  const queryString = 'UPDATE users SET image = $1 WHERE id = $2 RETURNING image';

  const result = await query(queryString, values);

  if (result.rowCount === 0) {
    return null;
  }
  return result.rows[0];
}

/**
 * Read all Categories asynchronously.
 *
 * @param {number} offset - offset on page
 *
 * @returns {Promise} Promise representing an array of all categories object
 */
async function readAllCategories(offset) {
  /* todo útfæra */

  const queryString = 'SELECT * from categories ORDER BY name LIMIT 10 OFFSET $1';

  const result = await query(queryString, [offset]);

  return result.rows;
}

/**
 * check if category exists
 * @param {string} name
 *
 * @returns {Promise} Promise representing the result category
 */
async function categoriesExist(name) {
  const q = 'SELECT * FROM Categories WHERE name = $1';
  const result = await query(q, [name]);
  if (result.rowCount === 1) {
    return true;
  }

  return false;
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

  const check = await categoriesExist(name);
  if (check) {
    return null;
  }

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
async function getAllBooks(offset) {
  /* todo útfæra */

  console.info(offset);
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
async function getOneBook(id) {
  /* todo útfæra */

  const queryString = 'SELECT * from books WHERE id = $1';
  const values = [xss(id)];

  const result = await query(queryString, values);

  return result;
}

/**
 *  check if ISBN exists
 *
 * @param {string} isbn13
 *
 * @returns {Promise} Promise representing the result ISBN
 */
async function isbn13Check(isbn13) {
  const q = 'SELECT * FROM Books WHERE ISBN13 = $1';

  const result = await query(q, [isbn13]);
  if (result.rowCount === 1) {
    return true;
  }
  return false;
}

/**
 *  check if title exists
 *
 * @param {string} title
 *
 * @returns {Promise} Promise representing the result ISBN
 */
async function titleCheck(title) {
  const q = 'SELECT * FROM Books WHERE title = $1';

  const result = await query(q, [title]);

  if (result.rowCount === 1) {
    return true;
  }
  return false;
}

/**
 * update a book asynchronously.
 *
 * @param {Object} book - book to update
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
 * @returns {Promise} Promise representing the object result of updating the book
 */
async function alterBook(
  id,
  {
    title = null,
    isbn10 = null,
    isbn13 = null,
    author = null,
    description = null,
    category = null,
    published = null,
    pagecount = null,
    language = null,
  } = {},
) {
  const queryString =
    'UPDATE Books SET title = COALESCE($1, title), ISBN13 = COALESCE($2, ISBN13), author = COALESCE($3, author), description = COALESCE($4, description), category = COALESCE($5, category), ISBN10 = COALESCE($6, ISBN10), published = COALESCE($7, published), pagecount = COALESCE($8, pagecount), language = COALESCE($9, language) WHERE id = $10 RETURNING *';

  let pages = parseInt(xss(pagecount), 10);

  if (Number.isNaN(pages)) {
    pages = null;
  }
  const values = [
    title,
    isbn13,
    author,
    description,
    category,
    isbn10,
    published,
    pages,
    language,
    id,
  ];

  const xssValues = values.map((val) => {
    if (val !== null || typeof val === 'number') {
      return xss(val);
    }
    return val;
  });

  if (isbn13) {
    const checkISBN = await isbn13Check(xss(isbn13));
    if (checkISBN) {
      return {
        hasErrors: true,
        error: 'ISBN13 er nú þegar til',
      };
    }
  }
  if (title) {
    const checkTitle = await titleCheck(xss(title));
    if (checkTitle) {
      return {
        hasErrors: true,
        error: 'Titill er nú þegar til',
      };
    }
  }

  if (category) {
    const checkCategory = await categoriesExist(xss(category));
    if (!checkCategory) {
      return {
        hasErrors: true,
        error: 'Category er ekki til',
      };
    }
  }

  const result = await query(queryString, xssValues);

  if (result.rowCount === 0) {
    return null;
  }

  /* success */
  return result.rows[0];
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
  const queryString =
    'INSERT INTO Books(title, ISBN13, author, description, category, ISBN10, published, pagecount, language) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';

  let pages = parseInt(xss(pagecount), 10);

  if (Number.isNaN(pages)) {
    pages = 0;
  }
  const values = [
    xss(title),
    xss(isbn13),
    xss(author),
    xss(description),
    xss(category),
    xss(isbn10),
    xss(published),
    pages,
    xss(language),
  ];

  const checkISBN = await isbn13Check(xss(isbn13));
  if (checkISBN) {
    return {
      hasErrors: true,
      error: 'ISBN13 er nú þegar til',
    };
  }
  const checkTitle = await titleCheck(xss(title));
  if (checkTitle) {
    return {
      hasErrors: true,
      error: 'Titill er nú þegar til',
    };
  }

  const checkCategory = await categoriesExist(xss(category));

  if (!checkCategory) {
    return {
      hasErrors: true,
      error: 'Category er ekki til',
    };
  }
  const result = await query(queryString, values);
  return result.rows[0];
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

  const queryString = 'SELECT * from readBooks where userid = $1';

  const result = await query(queryString, values);

  return result.rows;
}

/**
 *  check if book exists
 *
 *
 * @param {number} bookID
 *
 * @returns {Promise} Promise representing the result book
 */
async function getBookById(bookID) {
  const q = 'SELECT * FROM BOOKS WHERE id = $1';

  const result = await query(q, [bookID]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
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
  const values = [xss(userID), xss(bookID), xss(rating), xss(ratingtext)];

  const queryString =
    'INSERT into readBooks(userid, bookid, rating, ratingtext) VALUES ($1, $2, $3, $4) RETURNING *';

  const checkBook = await getBookById(xss(bookID));

  if (!checkBook) {
    return { hasErrors: true, error: 'Bókin er ekki til' };
  }

  const result = await query(queryString, values);

  return result.rows[0];
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

  const queryString = 'DELETE FROM readBooks WHERE userid = $1 AND id = $2';

  const values = [userID, bookID];
  console.log(bookID, userID);

  const result = await query(queryString, values);
  console.log(result);

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
  const queryString =
    'SELECT * from Books WHERE to_tsvector(title) @@ to_tsquery($1) OR to_tsvector(description) @@ to_tsquery($2) ORDER BY title LIMIT 10 OFFSET $3';
  const values = [xss(title), xss(description), xss(offset.toString())];

  const result = await query(queryString, values);

  return result;
}

module.exports = {
  createUser,
  readAllUsers,
  findById,
  findByUsername,
  alterUser,
  alterUserImage,
  readAllCategories,
  createCategory,
  getAllBooks,
  getOneBook,
  createBook,
  getReadBooks,
  addReadBook,
  del,
  search,
  comparePasswords,
  alterBook,
};
