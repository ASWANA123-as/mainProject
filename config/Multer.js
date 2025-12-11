const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./Cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "verification_docs",  // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
      resource_type: "raw",   // REQUIRED for PDFs
      type: "upload",         // ensures public asset
      access_mode: "public",  // makes PDF accessible without signing
      format: "pdf",  
  },
});

const upload = multer({ storage });

module.exports = upload;
