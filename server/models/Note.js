const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const NoteSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "undefined",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", NoteSchema);
module.exports = Note;
