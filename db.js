const {
  Client
} = require('pg');


const connectionString = process.env.DATABASE_URL;


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
async function register({username, password, name} = {}) {
  /* todo útfæra */
}

/** THURFUM THETTA ORUGGLEGA EKKI GERI THETTA BARA TIL ORYGGIS
 * Login a user asynchronously.
 *
 * @param {string} username - username of user
 * @param {string} password - password of user
 *
 * @returns {Promise} Promise representing the token for login
 */
async function login({ username, password } = {}) {
  /* todo útfæra */
}

/**
 * Read all users asynchronously.
 *
 * @returns {Promise} Promise representing an array of all user object
 */
async function readAllUsers() {
  /* todo útfæra */
}

/**
 * Read a single user asynchronously.
 *
 * @param {number} id - Id of user
 *
 * @returns {Promise} Promise representing the user object or null if not found
 */
async function readOneUser(id) {
  /* todo útfæra */
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
async function alterUser({ id, username, password } = {}){
    /* todo útfæra */
}

/**
 * Read all Categories asynchronously.
 *
 * @returns {Promise} Promise representing an array of all categories object
 */
async function readAllCategories() {
/* todo útfæra */
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
}

/**
 * Read all Books asynchronously.
 *
 * @returns {Promise} Promise representing an array of all Books object
 */
async function readAllBooks() {
    /* todo útfæra */
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
}

/**
 * create a book asynchronously.
 *
 * @param {Object} book - book to create
 *
 * @param {string} book.title - Title of book
 * @param {string} book.isbn - ISBN of book
 * @param {string} book.author - Author of book
 * @param {string} book.description - description of book
 * @param {string} book.category - category of book
 * @param {date}   book.date - date of book
 * @param {number} book.pages - number of pages in book
 * @param {string} book.language - language of book
 * 
 * @returns {Promise} Promise representing the object result of creating the book
 */
async function createBook({ title, isbn, author, description, category, date, pages, language } = {}) {
    /* todo útfæra */
}

/**
 * get read books 
 *
 * @param {number} userID
 *
 * @returns {Promise} Promise representing the array result of book
 */
async function getReadBooks(userID){
    /* todo */
}

/**
 * add read book
 *
 * @param {number} userID
 * @param {number} bookID
 *
 * @returns {Promise}  Promise representing of book
 */
async function addReadBook(userID,bookID){
    /* to do*/ 
}

/**
 * Delete a book asynchronously.
 *
 * @param {number} userID
 * @param {number} bookID - Id of note to delete
 *
 * @returns {Promise} Promise representing the boolean result of deleting the book
 */
async function del(userID, bookID) {
    /* todo útfæra */
  }


module.exports = {
  register,
  login,
  readAllUsers,
  readOneUser,
  alterUser,
  readAllCategories,
  createCategory,
  readAllBooks,
  readOneBook,
  createBook,
  getReadBooks,
  addReadBook,
  del,
};
