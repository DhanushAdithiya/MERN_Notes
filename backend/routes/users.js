const router = require("express").Router();
const JWT = require("jsonwebtoken");
let User = require("../models/user.model");

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

  const newUser = new User({ username, email, password });

  newUser
    .save()
    .then(() => res.json("User Added!"))
    .catch((err) => res.status(400).json("Error:  " + err));
});

module.exports = router;
