const router = require("express").Router();
let Notes = require("../models/notes.model");

router.route("/").get((req, res) => {
  Notes.find()
    .then((notes) => res.json(notes))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/").post((req, res) => {
  const owner = req.body.id;
  Notes.find({ owner: owner })
    .then((notes) => res.json(notes))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Notes.findById(req.params.id)
    .then((notes) => res.json(notes))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Notes.findByIdAndDelete(req.params.id)
    .then(() => res.json("Note Sucessfully deleted!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").patch((req, res) => {
  Notes.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((newNote) => res.json(newNote))
    .catch((err) => res.status(200).json("Error:  " + err));
});

router.route("/add").post((req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const owner = req.body.id;

  const newNote = new Notes({ title, body, owner });

  newNote
    .save()
    .then(() => res.json("Note Added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
