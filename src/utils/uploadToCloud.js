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