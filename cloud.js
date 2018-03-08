const cloud = require('cloudinary');

cloud.config({
  cloud_name: process.env.CLOUDINARY_NAME || 'hckoju8k4',
  api_key: process.env.CLOUDINARY_APIKEY || '844629566491216',
  api_secret: process.env.CLOUDINARY_APISECRET || 'VZA0mQvL25Bn1EsjvCzUVjThyP0',
});


async function upload(imageBuffer) {
  imageBuffer = imageBuffer.toString('base64');
  const result = await cloud.uploader.upload(`data:image/gif;base64,${imageBuffer}`);

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
