const router = require("express").Router();
const JWT = require("jsonwebtoken");
let User = require("../models/user.model");
const nodemailer = require("nodemailer");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/").post(async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({ username: username, password: password });
  console.log(user);

  if (user) {
    const token = JWT.sign(
      {
        username: user.username,
        password: user.password,
        id: user._id,
        email: user.email,
        verification: user.verified,
      },
      "secretkey"
    );

    console.log(token);

    return res.json({ token });
  } else {
    return res.status(400).json("Error: User not found!");
  }
});

router.route("/add").post((req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  require("dotenv").config();
  const newUser = new User({ username, email, password });

  newUser
    .save()
    .then(console.log(newUser))
    .then(() => res.json("User Added!"))
    .catch((err) => res.status(400).json("Error:  " + err));

  let mailTranporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  let details = {
    from: "userbotnotes@gmail.com",
    to: email,
    subject: "VERIFY YOUR EMAIL ADDRESS",
    text: `http://localhost:5000/users/verify/${newUser._id}`,
  };

  mailTranporter.sendMail(details, (err) => {
    if (err) {
      console.log("there is an error" + err);
    } else {
      console.log("Email Sent!");
    }
  });
});

router.route("/:id").patch((req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((newData) => res.json(newData))
    .catch((err) => res.status(400).json("Error" + err));
});

router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error" + err));
});

router.route("/verify/:id").get((req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    { verified: true },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((newData) => res.json(newData))
    .catch((err) => res.status(400).json("Error" + err));
});

module.exports = router;
