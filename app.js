const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
// middleware import
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
// routes import
const postsRoutes = require("./routes/postsRoute");
const trendsRoutes = require("./routes/trendsRoute");
const usersRoutes = require("./routes/usersRoute");
// db import
const connectDB = require("./config/db");

// configurations
dotenv.config();

// connect to DB
connectDB();

const upload = multer({ dest: "public/assets/images/" });

// create express instance
const app = express();

// app settings
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}));

// root routes 
app.use("/api/posts", postsRoutes);
app.use("/api/trends", trendsRoutes); 
app.use("/api/users", usersRoutes);

app.post("/api/upload-picture-evidence", upload.single("file"), (req, res) => {
    const imageName = req.file.filename;

    res.status(200).json({
        imageName
    });
});

// error handling middlewares
app.use(notFound);
app.use(errorHandler);

// app listen
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));