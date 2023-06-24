//Imports
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

//ENV VARIABLES
require("dotenv").config();

//EXPRESS SERVER
const app = express();
const port = process.env.PORT || 5000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful ");
  });

const userRouter = require("./routes/users");
const notesRouter = require("./routes/notes");

app.use("/users", userRouter);
app.use("/notes", notesRouter);

//SERVER
app.listen(port, () => {
  console.log("Sever is running on port:", port);
});
