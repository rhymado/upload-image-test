const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");

//SET STORAGE ENGINE
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

//INIT UPLOAD VARIABLE
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

//CHECK FILE TYPE
function checkFileType(file, cb) {
  //Allowed extension
  const fileTypes = /jpeg|jpg|png|gif/;
  //Check extension
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  //Check Mime
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    return cb("Error: Images Only");
  }
}

//INIT
const app = express();

//EJS
app.set("view engine", "ejs");

app.use(express.static("./public"));

app.get("/", (req, res) => res.render("index"));

app.post("/upload", (req, res) => {
  upload.single("myImage")(req, res, err => {
    if (err) {
      res.render("index", { msg: err });
    } else {
      if (req.file == undefined) {
        res.render("index", {
          msg: "Error: No File Selected"
        });
      } else {
        res.render("index", {
          msg: "File Uploaded",
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

app.post("/uploads", (req, res) => {
  upload.single("img")(req, res, err => {
    if (err) {
      res.send({
        msg: "Error: No File Selected"
      });
    } else {
      res.sendFile(__dirname + "/public/uploads/" + req.file.filename);
    }
  });
});

const port = 3000;
app.listen(port, () => console.log(`Server started on ${port}`));
