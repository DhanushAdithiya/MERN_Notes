const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notesSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notes = mongoose.model("Notes", notesSchema);
module.exports = Notes;
