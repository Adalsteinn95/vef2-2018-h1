const cloud = require('cloudinary');

cloud.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});


async function upload(imageBuffer) {
  const imageString = imageBuffer.toString('base64');
  const result = await cloud.uploader.upload(`data:image/gif;base64,${imageString}`);
  return result;
}

async function deleteImage(imageID) {
  const result = await cloud.uploader.destroy(imageID);
  return result;
}

module.exports = {
  upload,
  deleteImage,
};
