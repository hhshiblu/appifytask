const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createStorage = (subdir = "") => {
  const destination = subdir ? path.join("uploads", subdir) : "uploads";

  return multer.diskStorage({
    destination: (req, file, cb) => {
      fs.mkdirSync(destination, { recursive: true });
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  });
};

const createUpload = (subdir = "") =>
  multer({
    storage: createStorage(subdir),
    limits: { fileSize: 5 * 1024 * 1024 },
  });

const upload = createUpload();
const uploadComment = createUpload("comments");
const uploadReply = createUpload("replies");

module.exports = { upload, uploadComment, uploadReply };
