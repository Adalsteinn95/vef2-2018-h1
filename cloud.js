const cloud = require('cloudinary');

cloud.uploader.upload('mypictur.jpg', (result) => {
    console.info(result);
});
