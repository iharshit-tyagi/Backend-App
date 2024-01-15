import multer from "multer";

const storage = multer.diskStorage({
  //where file will be uploaded
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  //name of file to be saved in temp folder
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
