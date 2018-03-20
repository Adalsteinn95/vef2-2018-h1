const cloud = require('cloudinary');

cloud.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

/**
 *  Adds image to cloudinary
 *
 * @param {buffer} imageBuffer - buffer image
 *
 * @returns {Promise} result - object containing the information about the storage
 */
async function upload(imageBuffer) {
  const imageString = imageBuffer.toString('base64');

  let result;
  try {
    result = await cloud.uploader.upload(`data:image/gif;base64,${imageString}`);
  } catch (error) {
    throw error;
  }
  return result;
}

/**
 *  Delete image from cloudinary
 *
 * @param {string} imageID
 *
 * @returns {promise}
 */
async function deleteImage(imageID) {
  const result = await cloud.uploader.destroy(imageID);
  return result;
}

module.exports = {
  upload,
  deleteImage,
};
