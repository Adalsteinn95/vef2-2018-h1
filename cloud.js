const cloud = require('cloudinary');

cloud.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});


async function upload(imageURL) {
  const result = await cloud.uploader.upload(imageURL);

  return result;
}

async function del(imageID) {
  const result = await cloud.uploader.destroy(imageID);
  return result;
}


module.exports = {
  upload,
  del,
};
