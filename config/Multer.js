const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./Cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "verification_docs",  // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
  },
});

const upload = multer({ storage });

module.exports = upload;
