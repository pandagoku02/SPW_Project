const express = require("express");
const cors = require("cors");
const db = require("./config/mongoose");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const port = 5000;
const helmet = require('helmet');


const app = express();

app.use((req, res, next) => {
  // To be able to send cookies
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    methods: ["GET", "POST", "PATCH", "DELETE"],
    origin: "http://localhost:3000",
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });
app.post("/api/v1/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  return res.status(200).json({
    success: true,
    imageUrl: file.filename,
  });
});

app.use(express.json());
app.use(cookieParser());

// Enable Helmet middleware
app.use(helmet());
//removes the X-Powered-By header from the response
app.use(helmet.hidePoweredBy()); 
app.use(helmet.hsts());
app.use(helmet.frameguard());

app.use(helmet.xssFilter());
app.use(helmet.noSniff());

app.use("/", require("./routes"));

app.listen(port, (err) => {
  if (err) {
    console.log("Error in starting server!");
    return;
  }
  console.log(`Server is running on port: ${port}`);
});
