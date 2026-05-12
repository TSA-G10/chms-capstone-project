const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;

//Create `src/utils/uploadToCloud.js`:

//```js
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloud = (fileBuffer, folder = "chms", resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

module.exports = uploadToCloud;